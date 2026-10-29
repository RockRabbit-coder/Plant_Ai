import io
import base64
import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image

class GradCAM:
    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Register hooks
        self._hook_handles = []
        self._register_hooks()
        
    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output
            
        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0]
            
        h1 = self.target_layer.register_forward_hook(forward_hook)
        h2 = self.target_layer.register_full_backward_hook(backward_hook)
        self._hook_handles.extend([h1, h2])
        
    def generate_heatmap(self, input_tensor: torch.Tensor, class_idx: int) -> np.ndarray:
        """Computes Grad-CAM activation map for a given class index."""
        self.model.eval()
        self.model.zero_grad()
        
        # Forward pass
        output = self.model(input_tensor)
        score = output[0, class_idx]
        
        # Backward pass
        score.backward(retain_graph=True)
        
        # Pool gradients across channels
        gradients = self.gradients.detach().cpu().numpy()[0]
        activations = self.activations.detach().cpu().numpy()[0]
        
        weights = np.mean(gradients, axis=(1, 2))  # shape: (channels,)
        
        # Weighted combination of activation maps
        cam = np.zeros(activations.shape[1:], dtype=np.float32)
        for i, w in enumerate(weights):
            cam += w * activations[i]
            
        # Apply ReLU
        cam = np.maximum(cam, 0)
        
        # Normalize between 0 and 1
        cam_max = np.max(cam)
        if cam_max > 0:
            cam = cam / cam_max
        else:
            cam = np.zeros_like(cam)
            
        return cam

    def remove_hooks(self):
        for h in self._hook_handles:
            h.remove()

def generate_visual_explanation(
    model: torch.nn.Module,
    target_layer: torch.nn.Module,
    input_tensor: torch.Tensor,
    original_pil: Image.Image,
    class_idx: int
) -> dict:
    """Generate visual Grad-CAM heatmap overlay and severity estimate."""
    grad_cam = GradCAM(model, target_layer)
    try:
        raw_cam = grad_cam.generate_heatmap(input_tensor, class_idx)
    finally:
        grad_cam.remove_hooks()
        
    # Resize CAM to match original image size
    orig_w, orig_h = original_pil.size
    cam_resized = cv2.resize(raw_cam, (orig_w, orig_h))
    
    # Calculate affected leaf percentage based on high activation threshold (> 0.45)
    # Estimate leaf mask via green/yellow/brown color range to exclude white/gray background
    orig_cv = cv2.cvtColor(np.array(original_pil), cv2.COLOR_RGB2BGR)
    hsv = cv2.cvtColor(orig_cv, cv2.COLOR_BGR2HSV)
    
    # General plant leaf mask in HSV
    lower_leaf = np.array([15, 20, 20])
    upper_leaf = np.array([100, 255, 255])
    leaf_mask = cv2.inRange(hsv, lower_leaf, upper_leaf)
    
    leaf_pixels = np.count_nonzero(leaf_mask)
    if leaf_pixels < (orig_w * orig_h * 0.05):
        # Fallback if background masking didn't catch leaf
        total_pixels = orig_w * orig_h
        hotspot_pixels = np.count_nonzero(cam_resized > 0.45)
        severity_pct = round((hotspot_pixels / total_pixels) * 100, 1)
    else:
        hotspot_on_leaf = np.count_nonzero((cam_resized > 0.45) & (leaf_mask > 0))
        severity_pct = round((hotspot_on_leaf / leaf_pixels) * 100, 1)
        
    # Ensure reasonable bounded severity
    severity_pct = min(max(severity_pct, 1.0), 95.0)
    
    # Generate colored heatmap (JET or TURBO)
    heatmap_uint8 = np.uint8(255 * cam_resized)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    
    # Blend with original
    orig_np = np.array(original_pil)
    heatmap_color_rgb = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)
    blended = np.uint8(0.6 * orig_np + 0.4 * heatmap_color_rgb)
    
    # Encode blended image to Base64
    blended_pil = Image.fromarray(blended)
    buffered = io.BytesIO()
    blended_pil.save(buffered, format="JPEG", quality=90)
    blended_base64 = "data:image/jpeg;base64," + base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    # Encode standalone heatmap mask to Base64
    heatmap_pil = Image.fromarray(heatmap_color_rgb)
    buffered_hm = io.BytesIO()
    heatmap_pil.save(buffered_hm, format="JPEG", quality=85)
    heatmap_base64 = "data:image/jpeg;base64," + base64.b64encode(buffered_hm.getvalue()).decode("utf-8")
    
    return {
        "heatmap_overlay_base64": blended_base64,
        "heatmap_mask_base64": heatmap_base64,
        "estimated_affected_area_pct": severity_pct,
        "interpretation": (
            f"Model visual attention focuses on key lesion zones accounting for approximately "
            f"{severity_pct}% of the analyzed leaf area. Warmer colors (red/orange) indicate high-salience "
            f"features influencing the classification."
        )
    }

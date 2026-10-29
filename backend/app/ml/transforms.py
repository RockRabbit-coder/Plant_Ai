import io
import cv2
import numpy as np
from PIL import Image
from torchvision import transforms

# Standard ImageNet normalization for MobileNet / EfficientNet
INFERENCE_TRANSFORMS = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def check_image_quality(image_bytes: bytes) -> dict:
    """Assess image resolution, blurriness via Laplacian variance, and brightness."""
    # Convert bytes to PIL Image
    pil_image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if needed (handling RGBA, Grayscale, etc.)
    if pil_image.mode != "RGB":
        pil_image = pil_image.convert("RGB")
        
    width, height = pil_image.size
    
    # Convert to OpenCV format (BGR)
    cv_img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    
    # Calculate Laplacian variance for focus/blur detection
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    
    # Calculate average brightness (0-255)
    brightness = float(np.mean(gray))
    
    is_too_small = width < 120 or height < 120
    is_blurry = blur_score < 30.0
    is_too_dark = brightness < 30.0
    is_too_bright = brightness > 235.0
    
    quality_warnings = []
    if is_too_small:
        quality_warnings.append(f"Image resolution ({width}x{height}) is quite low. For best results, use at least 224x224 px.")
    if is_blurry:
        quality_warnings.append(f"Image appears blurry or out of focus (sharpness score: {blur_score:.1f}). Focus on leaf surface details.")
    if is_too_dark:
        quality_warnings.append("Image is very dark. Ensure leaves are well illuminated.")
    if is_too_bright:
        quality_warnings.append("Image has severe glare or overexposure. Avoid direct flash washing out leaf symptoms.")
        
    return {
        "width": width,
        "height": height,
        "blur_score": blur_score,
        "brightness": brightness,
        "is_blurry": is_blurry,
        "is_too_dark": is_too_dark,
        "is_too_bright": is_too_bright,
        "is_acceptable": not (is_too_small or (is_blurry and blur_score < 15.0) or brightness < 15.0),
        "quality_warnings": quality_warnings
    }

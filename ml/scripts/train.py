"""
Reproducible Training Pipeline for PlantCare AI Disease Classification.
Fine-tunes MobileNetV3 on PlantVillage (38 crop-disease categories).
"""

import os
import argparse
import time
from pathlib import Path
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
import torchvision.models as models

# Define Image Transformations with Data Augmentation
TRAIN_TRANSFORMS = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(p=0.2),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

VAL_TRANSFORMS = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def train_model(
    data_dir: str,
    output_model_path: str,
    epochs: int = 15,
    batch_size: int = 32,
    learning_rate: float = 0.001,
    num_classes: int = 38
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Training] Using device: {device}")
    
    train_dir = os.path.join(data_dir, "train")
    val_dir = os.path.join(data_dir, "val")
    
    if not os.path.exists(train_dir):
        print(f"[Error] Dataset directory '{train_dir}' not found. Please provide a valid PlantVillage directory.")
        return
        
    train_dataset = datasets.ImageFolder(train_dir, transform=TRAIN_TRANSFORMS)
    val_dataset = datasets.ImageFolder(val_dir, transform=VAL_TRANSFORMS)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=2)
    
    # Initialize MobileNetV3-Small
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    in_features = model.classifier[0].in_features
    model.classifier = nn.Sequential(
        nn.Linear(in_features, 512),
        nn.Hardswish(),
        nn.Dropout(p=0.2),
        nn.Linear(512, num_classes)
    )
    model.to(device)
    
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    
    best_acc = 0.0
    start_time = time.time()
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            correct += torch.sum(preds == labels.data).item()
            total += labels.size(0)
            
        epoch_loss = running_loss / total
        epoch_acc = correct / total
        
        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * inputs.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += torch.sum(preds == labels.data).item()
                val_total += labels.size(0)
                
        val_acc = val_correct / val_total
        scheduler.step()
        
        print(f"Epoch {epoch+1}/{epochs} | Train Loss: {epoch_loss:.4f} Acc: {epoch_acc*100:.2f}% | Val Loss: {val_loss/val_total:.4f} Val Acc: {val_acc*100:.2f}%")
        
        if val_acc > best_acc:
            best_acc = val_acc
            Path(output_model_path).parent.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), output_model_path)
            print(f" -> Saved best model weights with accuracy: {best_acc*100:.2f}%")
            
    print(f"[Training Complete] Best validation accuracy: {best_acc*100:.2f}% in {(time.time() - start_time)/60:.1f} mins.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train PlantCare AI MobileNetV3 Model")
    parser.add_argument("--data_dir", type=str, default="./ml/data/plantvillage", help="Path to dataset root with train/ and val/ folders")
    parser.add_argument("--output", type=str, default="./ml/models/plantcare_mobilenetv3.pth", help="Path to save weights")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=0.001)
    args = parser.parse_args()
    
    train_model(
        data_dir=args.data_dir,
        output_model_path=args.output,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr
    )

import os
import shutil
import zipfile
import nibabel as nib
import numpy as np
import torch
import imageio
from monai.transforms import (
    LoadImaged, EnsureChannelFirstd, Spacingd, ScaleIntensityRanged,
    CropForegroundd, Orientationd, Resized, Compose, EnsureTyped, NormalizeIntensityd
)
from monai.inferers import sliding_window_inference
from monai.networks.nets import SegResNet
from monai.data import Dataset, DataLoader
from monai.transforms import Activations, AsDiscrete
from PIL import Image

# -----------------
# CONFIG
# -----------------
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
STATIC_DIR = "app/static"
UPLOAD_DIR = "app/uploads"

def clear_static_folder():
    """Remove all old files in static folder."""
    if os.path.exists(STATIC_DIR):
        shutil.rmtree(STATIC_DIR)
    os.makedirs(STATIC_DIR, exist_ok=True)

# -----------------
# UTILS
# -----------------
def save_slices_as_jpg(volume, prefix):
    """Save each slice in volume as JPG and return list of file paths."""
    slice_paths = []
    volume = (volume - volume.min()) / (volume.max() - volume.min() + 1e-8)
    volume = (volume * 255).astype(np.uint8)

    for i in range(volume.shape[-1]):
        slice_img = volume[..., i]
        img = Image.fromarray(slice_img)
        filename = f"{prefix}slice{i:03d}.jpg"
        filepath = os.path.join(STATIC_DIR, filename)
        img.save(filepath)
        slice_paths.append(filepath)
    return slice_paths

def create_gif(slice_paths, gif_name):
    images = [imageio.imread(p) for p in slice_paths]
    gif_path = os.path.join(STATIC_DIR, gif_name)
    imageio.mimsave(gif_path, images, fps=10)
    return f"static/{gif_name}"

# -----------------
# PREPROCESSING (from Colab)
# -----------------
def get_transforms(pixdim=(1.0, 1.0, 1.0), spatial_size=(128, 128, 64)):
   
    return Compose([
        LoadImaged(keys=["image"]),
        EnsureChannelFirstd(keys=["image"]),
        EnsureTyped(keys=["image"]),
        Orientationd(keys=["image"], axcodes="RAS"),
        NormalizeIntensityd(keys="image", nonzero=True, channel_wise=True),
        Spacingd(keys=["image"], pixdim=pixdim, mode=("bilinear")),
       # ScaleIntensityRanged(
          #  keys=["image"], a_min=0, a_max=3000,
            #b_min=0.0, b_max=1.0, clip=True
        #),
        #CropForegroundd(keys=["image"], source_key="image"),
        #Resized(keys=["image"], spatial_size=spatial_size, mode="trilinear")
    ])

# -----------------
# MAIN SEGMENTATION
# -----------------
def run_segmentation(input_path, model_path, output_dir):
    clear_static_folder()

    # Handle multi-modality zip
    modalities = []
    if zipfile.is_zipfile(input_path):
        with zipfile.ZipFile(input_path, 'r') as zip_ref:
            zip_ref.extractall(UPLOAD_DIR)
        nii_files = sorted([os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith(".nii") or f.endswith(".nii.gz")])
        modalities = nii_files
    elif input_path.endswith(".nii.gz") or input_path.endswith(".nii"):
        modalities = [input_path]

    # If single FLAIR, repeat to make 4 channels
    if len(modalities) == 1:
        print("🧠 Single FLAIR detected (4x repeat)")
        modalities = modalities * 4

    if len(modalities) != 4:
        raise ValueError(f"Expected 4 modalities, got {len(modalities)}")

    # Load data using MONAI Dataset
    data_dict = [{"image": m} for m in modalities]
    transform = get_transforms()
    dataset = Dataset(data=data_dict, transform=transform)
    loader = DataLoader(dataset, batch_size=1)
    print("Data loader Initialzed")
    # Stack modalities into one 4-channel tensor
    data_4ch = []
    for batch in loader:
        img = batch["image"]  # shape: (1, 1, H, W, D)
        data_4ch.append(img.squeeze(0))  # remove batch dim
    data_4ch = torch.cat(data_4ch, dim=0).unsqueeze(0).to(DEVICE)  # shape: (1, 4, H, W, D)

    # Load model
    model = SegResNet(
        blocks_down=(1, 2, 2, 4),
        blocks_up=(1, 1, 1),
        init_filters=16,
        in_channels=4,
        out_channels=3,
        dropout_prob=0.2
    ).to(DEVICE)

    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
    model.eval()
    print("model initialzed and loaded")
    # Inference
    with torch.no_grad():
        output = sliding_window_inference(
           data_4ch, roi_size=(240, 240, 160),overlap=0.5, sw_batch_size=1, predictor=model
           #data_4ch, roi_size=(128, 128, 64),overlap=0.5, sw_batch_size=1, predictor=model
        )

    print("Model output shape:", output.shape, flush=True)
   # Argmax to get label map
    #pred_label = torch.argmax(output, dim=1).cpu().numpy()
    #print("Unique labels in prediction:", np.unique(pred_label), flush=True)
    #print("="*50 + "\n")
    # Postprocessing
    output = Activations(sigmoid=True)(output)
    output = AsDiscrete(threshold=0.5)(output)

    # Match depths
    if output.shape[-1] != data_4ch.shape[-1]:
        min_d = min(output.shape[-1], data_4ch.shape[-1])
        output = output[..., :min_d]
        data_4ch = data_4ch[..., :min_d]

    # Convert tensors to numpy for saving
    input_np = data_4ch.cpu().numpy()[0, 0, ...]  # just FLAIR channel for display
    output_np = output.cpu().numpy()[0, 1, ...]   # tumor mask channel 2

    # Save slices
    input_slices = save_slices_as_jpg(input_np, "input")
    output_slices = save_slices_as_jpg((output_np * 255).astype(np.uint8), "output")

    # Create GIF
    gif_url = create_gif(output_slices, "output.gif")

    return input_slices, output_slices, gif_url
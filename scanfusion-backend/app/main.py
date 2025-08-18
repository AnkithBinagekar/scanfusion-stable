from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.processor import run_segmentation

app = FastAPI()

# Allow CORS for all origins (frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
UPLOAD_DIR = "app/uploads"
STATIC_DIR = "app/static"
MODEL_PATH = "app/model.pt"

# Create folders
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

# Serve static files (images, GIFs)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.post("/process")
async def process_file(file: UploadFile = File(...)):
    """Handles file upload, runs segmentation, and returns result URLs."""
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())

    print(f"📂 Received file: {file_location}")

    try:
        input_slices, output_slices, gif_url = run_segmentation(file_location, MODEL_PATH, STATIC_DIR)
        print(f"✅ Processed {len(input_slices)} input slices & {len(output_slices)} output slices")

        return {
            "input": [f"static/{os.path.basename(p)}" for p in input_slices],
            "output": [f"static/{os.path.basename(p)}" for p in output_slices],
            "gif": gif_url
        }

    except Exception as e:
        print("❌ Segmentation Error:", e)
        return {"error": str(e)}
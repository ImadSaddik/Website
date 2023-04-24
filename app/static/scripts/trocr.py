import numpy as np
import tkinter as tk
import tkinter.filedialog as filedialog
from PIL import ImageGrab, Image
import pickle as pkl

def load_model():
    with open('app/static/models/words/model_processor.pkl', 'rb') as f:
        processor = pkl.load(f)
        model = pkl.load(f)
        
    return model, processor

def get_prediction(model, processor, image):
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    return generated_text
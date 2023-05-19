from app import app
from flask import render_template, request, redirect, jsonify

from app.static.scripts.trocr import load_model, get_prediction
from app.static.scripts.Segmenter import lineSegmentation
from PIL import Image
import io
import numpy as np
import cv2 as cv
import base64
import os

model = None
processor = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/digits')
def digits():
    return render_template('digits.html')

@app.route('/characters')
def character():
    return render_template('character.html')

@app.route('/words')
def words():
    return render_template('words.html')

@app.route('/docs')
def docs():
    return render_template('docs.html')

@app.route('/word_prediction', methods=["GET", "POST"])
def predict():
    global model, processor
    
    if request.method == "POST":
        if model is None and processor is None:
            model, processor = load_model()
        
        image_data = request.form.get('image')
        image = Image.open(io.BytesIO(base64.b64decode(image_data.split(',')[1])))
        image = Image.eval(image, lambda x: 255 - x)
        image_array = np.array(image)
        
        prediction = get_prediction(model, processor, image_array)
        return jsonify({'prediction': prediction})

    return render_template('words.html')

@app.route('/paragraph_prediction', methods=["GET", "POST"])
def predictMultiple():
    global model, processor
    
    if request.method == "POST":
        if model is None and processor is None:
            model, processor = load_model()
        
        image_data = request.form.get('image')
        image = Image.open(io.BytesIO(base64.b64decode(image_data.split(',')[1])))
        image = cv.cvtColor(np.array(image), cv.COLOR_RGB2BGR)
        regions = lineSegmentation(image)
        
        predictionString = ''
        for region in regions:
            image = cv.cvtColor(region, cv.COLOR_GRAY2BGR)
            prediction = get_prediction(model, processor, image)
            predictionString += prediction + '\n'
            predictionString = predictionString.replace('#', '')
            
        predictionString = "NAN" if predictionString == '' else predictionString
            
        return jsonify({'prediction': predictionString})
    
    return render_template('docs.html')
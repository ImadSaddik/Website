import cv2 as cv
import numpy as np

def lineSegmentation(img):
    denoisedImg = cv.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 20) 
    grayImg = cv.cvtColor(denoisedImg, cv.COLOR_BGR2GRAY)
    adaptiveImg = cv.adaptiveThreshold(grayImg, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 9, 6)
    errodedImg = cv.erode(adaptiveImg, kernel=(1, 1), iterations=1)
    
    horizontal_hist = errodedImg.shape[1] - np.sum(errodedImg, axis=1, keepdims=True) / 255
    
    regions = []
    pair = []
    for index, value in enumerate(horizontal_hist):
        if (index < horizontal_hist.shape[0] - 1) and (value > 0 and horizontal_hist[index + 1] == 0):
            pair.append(index)
        
        if index > 0 and (value > 0 and horizontal_hist[index - 1] == 0):
            pair.append(index)
            
        if len(pair) == 2:
            regions.append(errodedImg[pair[0]:pair[1], :])
            pair = []
            
    return regions
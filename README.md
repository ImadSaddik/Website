# iRecognize: Handwriting and Image-to-Text Recognition

iRecognize is a web application designed to recognize and convert handwritten text or uploaded images into digital text. With iRecognize, users can extract text from their handwritten notes, sketches, or images, making it easier to organize, search, and share their content digitally.

# Key Features
1. Handwriting Recognition: Users can draw directly on the canvas using their mouse or touch input. iRecognize uses our pre-trained models to accurately recognize and convert the handwritten digits or characters but for words and sentences we use Microsoft's TrOCR model to get accurate results.
2. Image-to-Text Conversion: iRecognize also supports image uploads, allowing users to extract text from existing images or scanned documents. The application utilizes image processing techniques and TrOCR to transform the text in the image into digital format.
3. User-Friendly Interface: The website features an intuitive and user-friendly interface, making it easy for users to interact with the canvas, upload images, and retrieve the recognized text. The interface is designed to provide a smooth and seamless experience for users of all skill levels.

# Technologies Used
iRecognize leverages a combination of the following technologies:

- Front-end: HTML, CSS, JavaScript
- Back-end: Flask
- Machine Learning: Tensorflow and TrOCR
- Image Processing: Techniques for image denoising, grayscaling and eroding
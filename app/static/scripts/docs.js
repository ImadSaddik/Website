const predictButton = document.getElementById('predict_button');
const browseButton = document.getElementById('browse_button');
const predictionTextPreview = document.getElementById('predict_preview');
const previewImage = document.getElementById('preview_image');
const previewHint = document.getElementById('preview_hint');


browseButton.addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function() {
            previewImage.src = reader.result;
            previewHint.innerHTML = "";
        }
        reader.readAsDataURL(file);
    });

    fileInput.click();
});

predictButton.addEventListener('click', function() {
    const formData = new FormData();
    const image = previewImage.src;
    formData.append('image', image);
  
    fetch('/paragraph_prediction', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
        predictionTextPreview.innerHTML = data.prediction;
    })
    .catch(error => console.error(error));
});
  
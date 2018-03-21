function onBodyLoad() {
  let imgElement = document.getElementById('img-element');
  let tintedContainerDiv = document.getElementById('tinted-container');
  let tints = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue'
  ];

  let tintedCanvases = [];

  tints.forEach(tint => {
    let canvasElement = document.createElement('canvas');
    canvasElement.width = imgElement.width;
    canvasElement.height = imgElement.height;
    let gc = canvasElement.getContext('2d');
    gc.drawImage(genTintedImage(imgElement, tint), 0, 0);
    tintedContainerDiv.appendChild(canvasElement);
    tintedCanvases.push(canvasElement);
  });

  gifshot.createGIF({
    images: tintedCanvases.map(c => c.toDataURL()),
    gifWidth: imgElement.width,
    gifHeight: imgElement.height
  }, function(obj) {
    if (!obj.error) {
      let image = obj.image,
      animatedImage = document.createElement('img');
      animatedImage.src = image;
      document.body.appendChild(animatedImage);
    }
  });
}

function genTintedImage(imgElement, fillStyle, blendMode='color') {
  let canvasElement = document.createElement('canvas');

  canvasElement.width = imgElement.width;
  canvasElement.height = imgElement.height;

  let gc = canvasElement.getContext('2d');

  let tintCanvas = document.createElement('canvas');
  tintCanvas.width = canvasElement.width;
  tintCanvas.height = canvasElement.height;
  var tgc = tintCanvas.getContext('2d');
  tgc.globalCompositeOperation = 'destination-atop';
  tgc.fillStyle = fillStyle;
  tgc.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
  tgc.drawImage(imgElement, 0, 0, tintCanvas.width, tintCanvas.height);

  gc.globalCompositeOperation = blendMode;
  gc.drawImage(imgElement, 0, 0, canvasElement.width, canvasElement.height);
  gc.drawImage(tintCanvas, 0, 0);

  return canvasElement;
}

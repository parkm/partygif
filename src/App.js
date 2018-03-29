import React, { Component } from 'react';
import './App.css';
import GIF from 'gif.js';

import theme from '@instructure/ui-themes/lib/canvas';
import Button from '@instructure/ui-core/lib/components/Button';
import FormFieldGroup from '@instructure/ui-core/lib/components/FormFieldGroup';
import RangeInput from '@instructure/ui-core/lib/components/RangeInput';
import FileDrop from '@instructure/ui-core/lib/components/FileDrop';
import Billboard from '@instructure/ui-core/lib/components/Billboard';

theme.use();

class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.quality = 1;
  }

  genGif = () => {
    let tints = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple'
    ];

    let tintedCanvases = [];

    tints.forEach(tint => {
      let canvasElement = document.createElement('canvas');
      canvasElement.width = this.uploadedImage.width;
      canvasElement.height = this.uploadedImage.height;
      let gc = canvasElement.getContext('2d');
      gc.drawImage(this.genTintedImage(this.uploadedImage, tint), 0, 0);
      this.tintedCanvasContainer.appendChild(canvasElement);
      tintedCanvases.push(canvasElement);
    });

    let gif = new GIF({
      workers: 2,
      quality: this.quality,
      workerScript: './gif.worker.js',
      transparent: 0xFFFFFF
    });

    tintedCanvases.forEach(c => gif.addFrame(c, {copy: true, delay: 0.001}));

    gif.on('finished', (blob) => {
      let img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      this.outputGifContainer.appendChild(img);
    });

    gif.render();
  }

  genTintedImage(imgElement, fillStyle, blendMode='color') {
    let canvasElement = document.createElement('canvas');
    canvasElement.width = imgElement.width;
    canvasElement.height = imgElement.height;

    let tintCanvas = document.createElement('canvas');
    tintCanvas.width = canvasElement.width;
    tintCanvas.height = canvasElement.height;

    let tgc = tintCanvas.getContext('2d');
    tgc.globalCompositeOperation = 'destination-atop';
    tgc.fillStyle = fillStyle;
    tgc.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
    tgc.drawImage(imgElement, 0, 0, tintCanvas.width, tintCanvas.height);

    let gc = canvasElement.getContext('2d');
    gc.globalCompositeOperation = blendMode;
    gc.drawImage(imgElement, 0, 0, canvasElement.width, canvasElement.height);
    gc.drawImage(tintCanvas, 0, 0);

    return canvasElement;
  }

  onFileUpload = ([file]) => {
    let reader = new FileReader();
    reader.onloadend = () => this.uploadedImage.src = reader.result;
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="App">
        <FormFieldGroup label="partygif" description="">
          <FileDrop
            accept={['.png', '.jpg', '.jpeg']}
            onDropAccepted={this.onFileUpload}
            onDropRejected={([file]) => { alert(`File rejected ${file.name}`) }}
            label={
              <Billboard
                size="small"
                message="Upload an image"
                hero={<img alt="" ref={r => this.uploadedImage = r} />}
              />
            }
          />
          <RangeInput label="Pixel Sample Interval (Lower is better quality)" defaultValue={1} min={1} max={20} onChange={v => this.quality = v}/>
        </FormFieldGroup>
        <Button onClick={this.genGif}>Generate</Button>
        <div ref={r => this.tintedCanvasContainer = r}></div>
        <div ref={r => this.outputGifContainer = r}></div>
      </div>
    );
  }
}

export default App;

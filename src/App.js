import React, { Component } from 'react';
import './App.css';
import GIF from 'gif.js';

import theme from '@instructure/ui-themes/lib/canvas';
import Button from '@instructure/ui-core/lib/components/Button';
import FormFieldGroup from '@instructure/ui-core/lib/components/FormFieldGroup';
import RangeInput from '@instructure/ui-core/lib/components/RangeInput';
import FileDrop from '@instructure/ui-core/lib/components/FileDrop';
import Billboard from '@instructure/ui-core/lib/components/Billboard';
import Heading from '@instructure/ui-core/lib/components/Heading';
import Text from '@instructure/ui-core/lib/components/Text';
import Container from '@instructure/ui-core/lib/components/Container';
import Flex, {FlexItem} from '@instructure/ui-layout/lib/components/Flex';
import IconX from '@instructure/ui-icons/lib/Solid/IconX';
import IconPlus from '@instructure/ui-icons/lib/Solid/IconPlus';

import ColorSelect from './ColorSelect';

theme.use();

class App extends Component {
  constructor() {
    super();
    this.state = {
      tints: [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple'
      ]
    };
    this.quality = 1;
    this.alphaColor = '#ffffff';
  }

  genGif = () => {
    if (this.uploadedImage.src.length <= 0
    || this.state.tints.length <= 0) {
      return;
    }

    let tints = this.state.tints;
    let tintedCanvases = [];

    this.tintedCanvasContainer.innerHTML = '';
    this.outputGifContainer.innerHTML = '';

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
      transparent: '0x' + this.alphaColor.replace('#', '')
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

  onAddTintBlockClick = () => {
    let tints = this.state.tints;
    tints.push('white');
    this.setState({tints: tints});
  }

  onRemoveTintBlockClick = (index) => {
    let tints = this.state.tints;
    tints.splice(index, 1);
    this.setState({tints: tints});
  }

  onTintBlockUpdate = (tint, index) => {
    let tints = this.state.tints;
    tints.splice(index, 1, tint);
    this.setState({tints: tints});
  }

  renderTintBlock(tint, index) {
    return (
      <FlexItem key={tint} padding="x-small">
        <Flex>
          <div style={{border: '1px solid lightgray'}}>
            <FlexItem>
              <ColorSelect label="" defaultColor={tint} onColorHide={colorHex => this.onTintBlockUpdate(colorHex, index)} />
            </FlexItem>
            <FlexItem>
            <Container as="div" margin="small">
            <Text>Frame {index}</Text>
            <Button margin="0 0 0 small" size="small" variant="circle-danger" onClick={_ => this.onRemoveTintBlockClick(index)}>
              <IconX />
            </Button>
            </Container>
            </FlexItem>
          </div>
        </Flex>
      </FlexItem>
    );
  }

  render() {
    return (
      <div className="App">
        <Heading margin="small">PartyGif</Heading>
        <Container as="div" textAlign="center" padding="large">
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
            <div style={{width:"30%"}}>
              <RangeInput label="Pixel Sample Interval (Lower is better quality)" defaultValue={1} min={1} max={20} onChange={v => this.quality = v}/>
            </div>
            <ColorSelect label="Alpha Color" onChangeComplete={colorHex => this.alphaColor=colorHex} />
            <Flex wrapItems>
              {this.state.tints.map((tint, i) => {
                return this.renderTintBlock(tint, i)
              })}
              <FlexItem>
                <Button variant="circle-primary" onClick={this.onAddTintBlockClick}>
                  <IconPlus />
                </Button>
              </FlexItem>
            </Flex>
          </FormFieldGroup>
          <Button onClick={this.genGif}>Generate</Button>
          <Container as="div" padding="medium">
            <div ref={r => this.tintedCanvasContainer = r}></div>
            <div ref={r => this.outputGifContainer = r}></div>
          </Container>
        </Container>
      </div>
    );
  }
}

export default App;

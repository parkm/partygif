import { Component } from 'react';
import GIF from 'gif.js';

import {
  Button,
  Container,
  Typography,
  Slider,
  Stack,
  Box,
  Paper,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import ColorSelect from './ColorSelect';

class PartyGif extends Component {
  constructor() {
    super();
    this.state = {
      tints: [
        '#FF6B6B',
        '#FF6BB5',
        '#FF81FF',
        '#D081FF',
        '#81ACFF',
        '#81FFFF',
        '#81FF81',
        '#FFD081',
        '#FF8181'
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
      console.log('finished');
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

  setOriginalColors = () => {
    this.setState({tints: [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple'
    ]})
  }

  setPartyColors = () => {
    this.setState({tints: [
      '#FF6B6B',
      '#FF6BB5',
      '#FF81FF',
      '#D081FF',
      '#81ACFF',
      '#81FFFF',
      '#81FF81',
      '#FFD081',
      '#FF8181'
    ]})
  }

  setCustomColors = () => {
    const colorString = prompt('Add colors', this.state.tints.join(','))
    if (!colorString) return;
    const colors = colorString.split(',').map(c => c.trim())
    this.setState({ tints: colors })
  }

  renderTintBlock(tint, index) {
    return (
      <Box key={tint} sx={{ p: 1 }}>
        <Paper elevation={1} sx={{ p: 1 }}>
          <Stack spacing={1}>
            <ColorSelect
              label=""
              defaultColor={tint}
              onColorHide={colorHex => this.onTintBlockUpdate(colorHex, index)}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Frame {index}</Typography>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={_ => this.onRemoveTintBlockClick(index)}
                sx={{ minWidth: 'auto', borderRadius: '50%' }}
              >
                <CancelIcon />
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  render() {
    return (
      <div className="App">
        <Typography variant="h4" sx={{ m: 2 }}>PartyGif</Typography>
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
          <Stack spacing={3}>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
              component="label"
            >
              <input
                type="file"
                hidden
                accept=".png,.jpg,.jpeg"
                onChange={(e) => this.onFileUpload([e.target.files[0]])}
              />
              <Stack spacing={2} alignItems="center">
                <UploadFileIcon fontSize="large" />
                <Typography>Upload an image</Typography>
                <img alt="" ref={r => this.uploadedImage = r} style={{ maxWidth: '100%' }} />
              </Stack>
            </Paper>
            <Box sx={{ width: '30%', mx: 'auto' }}>
              <Slider
                defaultValue={1}
                min={1}
                max={20}
                onChange={(_, v) => this.quality = v}
                aria-label="Pixel Sample Interval"
                valueLabelDisplay="auto"
              />
              <Typography variant="caption">
                Pixel Sample Interval (Lower is better quality)
              </Typography>
            </Box>
            <ColorSelect
              label="Alpha Color"
              onChangeComplete={colorHex => this.alphaColor=colorHex}
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" onClick={this.setOriginalColors}>
                Use basic colors
              </Button>
              <Button variant="contained" onClick={this.setPartyColors}>
                Use party colors
              </Button>
              <Button variant="contained" onClick={this.setCustomColors}>
                Set custom colors
              </Button>
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {this.state.tints.map((tint, i) => this.renderTintBlock(tint, i))}
              <Box sx={{ p: 1 }}>
                <Button
                  variant="contained"
                  sx={{ minWidth: 'auto', borderRadius: '50%', p: 1 }}
                  onClick={this.onAddTintBlockClick}
                >
                  <AddCircleIcon />
                </Button>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.genGif}
            >
              Generate
            </Button>
            <Box sx={{ mt: 3 }}>
              <div ref={r => this.tintedCanvasContainer = r}></div>
              <div ref={r => this.outputGifContainer = r}></div>
            </Box>
          </Stack>
        </Container>
      </div>
    );
  }
}

export default PartyGif;
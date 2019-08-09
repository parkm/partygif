import React, { Component } from 'react';

import Button from '@instructure/ui-core/lib/components/Button';
import Text from '@instructure/ui-core/lib/components/Text';
import { SketchPicker } from 'react-color';

export default class ColorSelect extends Component {
  constructor() {
    super();
    this.state = {
      showColorPicker: false,
      colorHex: '#ffffff'
    };
  }

  componentWillMount() {
    if (this.props.defaultColor) {
      this.setState({colorHex: this.props.defaultColor});
    }
  }

  onChangeComplete = (color) => {
    this.setState({colorHex: color.hex});
    if (this.props.onChangeComplete) {
      this.props.onChangeComplete(color.hex);
    }
  }

  onButtonClick = (e) => {
    let show = !this.state.showColorPicker;
    this.setState({showColorPicker: show});
    if (show) {
      if (this.props.onColorShow) {
        this.props.onColorShow(this.state.colorHex);
      }
    } else {
      if (this.props.onColorHide) {
        this.props.onColorHide(this.state.colorHex);
      }
    }
  }

  render() {
    return (
      <div>
        <Text weight="bold">{this.props.label}</Text>
        <Button margin="small" onClick={this.onButtonClick}>
          <div className="color-select-icon" style={{background: this.state.colorHex}}/>
        </Button>
        {
          this.state.showColorPicker ?
            <SketchPicker disableAlpha={true} onChangeComplete={this.onChangeComplete} color={this.state.colorHex} />
          : null
        }
      </div>
    );
  }
}

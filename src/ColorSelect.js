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

  onChangeComplete = (color) => {
    this.setState({colorHex: color.hex});
    if (this.props.onChangeComplete) {
      this.props.onChangeComplete(color.hex);
    }
  }

  render() {
    return (
      <div>
        <Text>{this.props.label}</Text>
        <Button onClick={e => this.setState({showColorPicker: !this.state.showColorPicker})}>
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

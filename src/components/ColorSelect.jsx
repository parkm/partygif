import { Component } from 'react';
import {
  Button,
  Typography,
  Box,
  Popover
} from '@mui/material';
import { SketchPicker } from 'react-color';

export default class ColorSelect extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      colorHex: '#ffffff'
    };
  }

  componentDidMount() {
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

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
    if (this.props.onColorShow) {
      this.props.onColorShow(this.state.colorHex);
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
    if (this.props.onColorHide) {
      this.props.onColorHide(this.state.colorHex);
    }
  };

  render() {
    const open = Boolean(this.state.anchorEl);

    return (
      <Box>
        {this.props.label && (
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            {this.props.label}
          </Typography>
        )}

        <Button
          onClick={this.handleClick}
          sx={{
            minWidth: 'auto',
            p: 0,
            mr: 1,
            border: '1px solid rgba(0, 0, 0, 0.23)',
            '&:hover': {
              border: '1px solid rgba(0, 0, 0, 0.23)',
            }
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              backgroundColor: this.state.colorHex,
              borderRadius: '2px',
            }}
          />
        </Button>

        <Popover
          open={open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPopover-paper': {
              boxShadow: 3,
              mt: 1
            }
          }}
        >
          <SketchPicker
            disableAlpha={true}
            onChangeComplete={this.onChangeComplete}
            color={this.state.colorHex}
          />
        </Popover>
      </Box>
    );
  }
}

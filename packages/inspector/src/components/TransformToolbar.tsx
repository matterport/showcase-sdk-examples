import React, { Component } from 'react';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { cdnUrl } from '@mp/common';
import styled from '@emotion/styled';


export enum Selection {
  Translate = 'translate',
  Rotate = 'rotate',
  Scale = 'scale',
}

const styles = {
  root: { //is this used?
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: '200px',
  },
  controls: {
    height: '80px',
    display: 'flex',
    paddingLeft: '8px',
  },
};
const ControlsDiv = styled.div(styles.controls);

interface Props {
  selectionChanged: (item: Selection) => void;
}

interface State {
  selection: Selection;
}

export class TransformToolbar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selection: Selection.Translate,
    };

    this.handleSelection = this.handleSelection.bind(this);
  }

  private handleSelection(event: React.MouseEvent<HTMLElement>, selection: Selection) {
    this.setState({
      selection,
    });
    
    if (this.props.selectionChanged) {
      this.props.selectionChanged(selection);
    }
  };

  render() {
    return (
      <ControlsDiv>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <div>
              <ToggleButtonGroup
                value={this.state.selection}
                exclusive
                onChange={this.handleSelection}
                aria-label="text alignment"
              >
                <ToggleButton value={Selection.Translate} aria-label="left aligned">
                <img src={`${cdnUrl}/textures/move.jpg`} alt="Kitten" height="40" width="40"/>
                </ToggleButton>
                <ToggleButton value={Selection.Rotate} aria-label="centered">
                <img src={`${cdnUrl}/textures/rotate.jpg`} alt="Kitten" height="40" width="40"/>
                </ToggleButton>
                <ToggleButton value={Selection.Scale} aria-label="right aligned">
                  <img src={`${cdnUrl}/textures/scale.jpg`} alt="Kitten" height="40" width="40"/>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </Grid>
          
        </Grid>
      </ControlsDiv>
    );
  }
}

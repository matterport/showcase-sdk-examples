import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { cdnUrl } from '@mp/common';

const useStyles = makeStyles(theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: '200px',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    height: 'calc(100vh - 16px)',
    padding: '8px',
  },
  controls: {
    height: '80px',
    display: 'flex',
    paddingLeft: '8px',
  },
  toggleContainer: {
    margin: theme.spacing(2, 0),
  },
}));

export enum Selection {
  Translate = 'translate',
  Rotate = 'rotate',
  Scale = 'scale',
}

export default function TransformToolbar(props: { selectionChanged: (item: Selection) => void }) {
  const [selection, setSelection] = React.useState(Selection.Translate);
  
  const handleSelection = (event: React.MouseEvent<HTMLElement>, selection: Selection) => {
    setSelection(selection);
    props.selectionChanged(selection);
  };

  const classes = useStyles({});
  return (
    <div className={classes.controls}>
      <Grid container spacing={2}>
        <Grid item sm={12} md={6}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup
              value={selection}
              exclusive
              onChange={handleSelection}
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
    </div>
  )
}

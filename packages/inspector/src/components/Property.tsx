import * as React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { TextField, Typography } from '@material-ui/core';
import { Euler, MathUtils } from 'three';
import { timer } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { ISceneNode } from '../Scene';

interface IVector3 {
  x: number;
  y: number;
  z: number;
};

const useStyles = makeStyles(
  createStyles({
    container:  {
      flexGrow: 1,
      height: '100%',
      alignItems: 'stretch',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#BBBBBB',
      minWidth: 300,

    },
    group: {
      alignItems: 'stretch',
      padding: 5,
      justifyContent: 'space-between',
    },
    textField: {
      width: 60,
      fontSize: '9pt',
      padding: '6px',
    },
    label: {
      flex: 1,
      fontSize: '9pt',
      paddingTop: '12px',
    },
    rowGroup: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
    },
  }),
);

const defaultVector3 = {x: 0, y: 0, z: 0};
const defaultScale = {x: 1, y: 1, z: 1};
export default function PropertyView(props: { selection: ISceneNode}) {
  const classes = useStyles({});
  const [position, setPosition] = React.useState<IVector3>(defaultVector3);
  const [rotation, setRotation] = React.useState<IVector3>(defaultVector3);
  const [scale, setScale] = React.useState<IVector3>(defaultScale);

  React.useEffect(() => {
    if (!props.selection) {
      return () => {};
    }

    const posSub = timer(0, 50).pipe(
      switchMap(() => [props.selection]),
      map<ISceneNode, IVector3>((value: ISceneNode) => {
        return { x: value.position.x, y: value.position.y, z: value.position.z }
      }),
      distinctUntilChanged((a: IVector3, b: IVector3) => (a.x === b.x && a.y === b.y && a.z === b.z)),
    ).subscribe((position: IVector3) => {
      setPosition(position);
    });

    const scaleSub = timer(0, 50).pipe(
      switchMap(() => [props.selection]),
      map<ISceneNode, IVector3>((value: ISceneNode) => {
        return { x: value.scale.x, y: value.scale.y, z: value.scale.z }
      }),
      distinctUntilChanged((a: IVector3, b: IVector3) => (a.x === b.x && a.y === b.y && a.z === b.z)),
    ).subscribe((scale: IVector3) => {
      setScale(scale);
    });

    const euler = new Euler(0, 0, 0, 'YXZ');
    const rotSub = timer(0, 50).pipe(
      switchMap(() => [props.selection]),
      map<ISceneNode, IVector3>((value: ISceneNode) => {
        euler.setFromQuaternion(value.quaternion);
        return { x: MathUtils.radToDeg(euler.x), y: MathUtils.radToDeg(euler.y), z: MathUtils.radToDeg(euler.x) }
      }),
      distinctUntilChanged((a: IVector3, b: IVector3) => (a.x === b.x && a.y === b.y && a.z === b.z)),
    ).subscribe((rotation: IVector3) => {
      setRotation(rotation);
    });

    return () => {
      posSub.unsubscribe();
      rotSub.unsubscribe();
      scaleSub.unsubscribe();
    };
  }, [props.selection]);

  const onChange = (e: any) => {
    if (!props.selection) {
      return;
    }

    let x = position.x;

    try {
      x = parseFloat(e.target.value);
    }
    catch(e) {}

    const nextPosition = {
      x: x,
      y: position.y,
      z: position.z,
    };
    setPosition(nextPosition);
    props.selection.position.x = nextPosition.x;
    props.selection.position.y = nextPosition.y;
    props.selection.position.z = nextPosition.z;
  };

  return (
    <div className={classes.container}>

      <div className={classes.group}>
        <div className={classes.rowGroup}>
          <div className={classes.textField}>
            <Typography className={classes.label}>Position</Typography>
          </div>
          <TextField
            className={classes.textField}
            value={position.x}
            label="x"
            id="position-x"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            onChange={(e) => onChange(e)}
            disabled={true}
          />
          <TextField
            className={classes.textField}
            label="y"
            value={position.y.toFixed(4)}
            id="position-y"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
          <TextField
            className={classes.textField}
            label="z"
            value={position.z.toFixed(4)}
            id="position-z"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
        </div>
      </div>

      <div className={classes.group}>

        <div className={classes.rowGroup}>
          <div className={classes.textField}>
            <Typography className={classes.label}>Rotation</Typography>
          </div>
          <TextField
            className={classes.textField}
            value={rotation.x.toFixed(2)}
            label="pitch(x)"
            id="rotation-x"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
          <TextField
            className={classes.textField}
            label="yaw(y)"
            value={rotation.y.toFixed(2)}
            id="rotation-y"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
          <TextField
            className={classes.textField}
            label="roll(z)"
            value={rotation.z.toFixed(2)}
            id="rotation-z"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
        </div>
      </div>

      <div className={classes.group}>
        <div className={classes.rowGroup}>
          <div className={classes.textField}>
            <Typography className={classes.label}>Scale</Typography>
          </div>
          <TextField
            className={classes.textField}
            value={scale.x.toFixed(2)}
            label="x"
            id="scale-x"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
          <TextField
            className={classes.textField}
            label="y"
            value={scale.y.toFixed(2)}
            id="scale-y"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
          <TextField
            className={classes.textField}
            label="z"
            value={scale.z.toFixed(2)}
            id="scale-z"
            variant="outlined"
            margin="dense"
            InputProps={{
              classes: {
                input: classes.textField,
              },
            }}
            disabled={true}
          />
        </div>
      </div>

    </div>
  );
}

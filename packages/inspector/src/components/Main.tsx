import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SceneView from './SceneView';
import PropertyView from './Property';
import FrameView from './Frame';
import { ISdk } from '../Sdk';
import { Object3D } from 'three';
import TransformToolbar, { Selection } from './TransformToolbar';
import SceneDropZone from './SceneDropZone';
import { IScene, ISceneNode } from '../Scene';
import { gridType, makeGrid } from '../Grid';
import { Button } from '@material-ui/core';
import { initComponents } from '@mp/common';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
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
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexGrow: 1,
    padding: '8px',
  },
  toolbar: {
    display: 'flex',
    width: '100vw',
    height: '80px',
  },
  button: {
    height:'48px',
    paddingTop: '10px',
    margin: '12px',
  }
});

// Hmm, where have we seen this before
export const saveBlobAsFile = (function () {
  const URL = (window.URL || window.webkitURL);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  return (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
}());

export default function SimpleMenu(props: { sdk: ISdk, scene: IScene }) {
  const [scene, setScene] = React.useState<ISceneNode[]>([]);
  const [selection, setSelection] = React.useState<ISceneNode>(null);
  const widgetRef  = React.useRef(null);

  React.useEffect(() => {
    props.scene.objects.subscribe({
      next: (v) => setScene(v)
    });
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  let modelSid = 'j4RZx7ZGM6T';
  if (urlParams.has('m')) {
    modelSid = urlParams.get('m');
  }

  const src = `./bundle/showcase.html?m=${modelSid}&play=1&qs=1`;

  props.sdk.onChanged( async (theSdk: any)=> {
    await Promise.all([
      theSdk.Scene.register(gridType, makeGrid),
      initComponents(theSdk),
    ]);

    let objects: Object3D[] = [];
    try {
      objects = await theSdk.Scene.query(['scene']);
    }
    catch(e) {
      console.log(e);
    }

    const node = await theSdk.Scene.createNode();
    widgetRef.current = node.addComponent('mp.transformControls', {
      scene: objects,
    });
    node.start();

//    setScene(objects);
  });

  const itemSelected = (item: ISceneNode) => {
    console.log(item);
    if (widgetRef.current && widgetRef.current.inputs.selection === item.obj3D) {
      setSelection(null);
      widgetRef.current.inputs.selection = null;
    } else {
      setSelection(item);
      if (widgetRef.current) {
        widgetRef.current.inputs.selection = item.obj3D;
      }
    }
  };

  const transformSelected = (selection: Selection) => {
    widgetRef.current.inputs.mode = selection;
  };

  const dropped = async (objects: string) => {
    await props.scene.deserialize(objects);
  };

  const onSave = async () => {
    const serialized = await props.scene.serialize();
    const blob = new Blob([serialized], { type : 'text/plain;charset=utf-8' });
    saveBlobAsFile(blob, 'scene.json');
  };

  const classes = useStyles({});
  return (
    <div className={classes.wrapper}>
      <div className={classes.toolbar}>
        <TransformToolbar selectionChanged={transformSelected}></TransformToolbar>
        <SceneDropZone cb={dropped}></SceneDropZone>
        <Button onClick={() => onSave()} className={classes.button} variant='contained'>Save Scene</Button>
      </div>
      <div className={classes.container}>
        <SceneView scene={scene} selectionChanged={itemSelected}></SceneView>
        <FrameView src={src}></FrameView>
        <PropertyView selection={selection}></PropertyView>
      </div>
    </div>
  );
}

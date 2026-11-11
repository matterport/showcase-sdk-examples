import React, { Component } from 'react';
import { Subscription, timer } from 'rxjs';
import type { MpSdk } from '../../../bundle/sdk';
import { switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { Vector3View } from './Vector3View';
import { AppContext } from '../AppContext';
import { IAppContext } from '../interfaces';
import styled from '@emotion/styled';

const defaultVector3 = { x: 0, y: 0, z: 0 };
const defaultScale = { x: 1, y: 1, z: 1 };

const styles = {
  container: {
    alignItems: 'stretch',
    padding: 6,
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#BBBBBB',
  },
};

const ContainerDiv = styled.div(styles.container);
interface Props {
  selection: MpSdk.Scene.INode;
}

interface State {
  position: MpSdk.Vector3;
  rotation: MpSdk.Vector3;
  scale: MpSdk.Vector3;
}

export class SceneNodeTransformView extends Component<Props, State> {
  static contextType = AppContext;
  declare context: IAppContext;
  private posSub: Subscription = null;
  private scaleSub: Subscription = null;
  private rotSub: Subscription = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      position: defaultVector3,
      rotation: defaultVector3,
      scale: defaultScale,
    };
  }

  componentWillUnmount() {
    this.ensureUnsubscribed();
  }

  private ensureSubscribed() {
    if (this.posSub === null) {
      this.posSub = timer(0, 50)
        .pipe(
          switchMap(() => [this.props.selection]),
          map<MpSdk.Scene.INode, MpSdk.Vector3>((value: MpSdk.Scene.INode) => {
            return { x: value.position.x, y: value.position.y, z: value.position.z };
          }),
          distinctUntilChanged((a: MpSdk.Vector3, b: MpSdk.Vector3) => a.x === b.x && a.y === b.y && a.z === b.z)
        )
        .subscribe((position: MpSdk.Vector3) => {
          this.setState({
            position,
          });
        });
    }

    if (this.scaleSub === null) {
      this.scaleSub = timer(0, 50)
        .pipe(
          switchMap(() => [this.props.selection]),
          map<MpSdk.Scene.INode, MpSdk.Vector3>((value: MpSdk.Scene.INode) => {
            return { x: value.scale.x, y: value.scale.y, z: value.scale.z };
          }),
          distinctUntilChanged((a: MpSdk.Vector3, b: MpSdk.Vector3) => a.x === b.x && a.y === b.y && a.z === b.z)
        )
        .subscribe((scale: MpSdk.Vector3) => {
          this.setState({
            scale,
          });
        });
    }

    if (this.rotSub === null) {
      const THREE = this.context.sdk.sdk.Scene.THREE;
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      this.rotSub = timer(0, 50)
        .pipe(
          switchMap(() => [this.props.selection]),
          map<MpSdk.Scene.INode, MpSdk.Vector3>((value: MpSdk.Scene.INode) => {
            euler.setFromQuaternion(value.quaternion);
            return { x: THREE.MathUtils.radToDeg(euler.x), y: THREE.MathUtils.radToDeg(euler.y), z: THREE.MathUtils.radToDeg(euler.z) };
          }),
          distinctUntilChanged((a: MpSdk.Vector3, b: MpSdk.Vector3) => a.x === b.x && a.y === b.y && a.z === b.z)
        )
        .subscribe((rotation: MpSdk.Vector3) => {
          this.setState({
            rotation,
          });
        });
    }
  }

  private ensureUnsubscribed() {
    if (this.posSub) {
      this.posSub.unsubscribe();
      this.posSub = null;
    }

    if (this.scaleSub) {
      this.scaleSub.unsubscribe();
      this.scaleSub = null;
    }

    if (this.rotSub) {
      this.rotSub.unsubscribe();
      this.rotSub = null;
    }
  }

  render() {
    const { position, rotation, scale } = this.state;

    if (this.props.selection !== null) {
      this.ensureSubscribed();
    } else {
      this.ensureUnsubscribed();
    }

    return (
      <ContainerDiv>
        <Vector3View x={position.x} y={position.y} z={position.z} label="Position"></Vector3View>
        <Vector3View x={rotation.x} y={rotation.y} z={rotation.z} label="Rotation"></Vector3View>
        <Vector3View x={scale.x} y={scale.y} z={scale.z} label="Scale"></Vector3View>
      </ContainerDiv>
    );
  }
}

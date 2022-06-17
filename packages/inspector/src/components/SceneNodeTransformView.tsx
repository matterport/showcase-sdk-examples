import React, { Component } from 'react';
import { Subscription, timer } from 'rxjs';
import { ISceneNode, IVector3 } from '@mp/common';
import { switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { MathUtils, Euler } from 'three';
import { Vector3View } from './Vector3View';
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
  selection: ISceneNode;
}

interface State {
  position: IVector3;
  rotation: IVector3;
  scale: IVector3;
}

export class SceneNodeTransformView extends Component<Props, State> {
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
          map<ISceneNode, IVector3>((value: ISceneNode) => {
            return { x: value.position.x, y: value.position.y, z: value.position.z };
          }),
          distinctUntilChanged((a: IVector3, b: IVector3) => a.x === b.x && a.y === b.y && a.z === b.z)
        )
        .subscribe((position: IVector3) => {
          this.setState({
            position,
          });
        });
    }

    if (this.scaleSub === null) {
      this.scaleSub = timer(0, 50)
        .pipe(
          switchMap(() => [this.props.selection]),
          map<ISceneNode, IVector3>((value: ISceneNode) => {
            return { x: value.scale.x, y: value.scale.y, z: value.scale.z };
          }),
          distinctUntilChanged((a: IVector3, b: IVector3) => a.x === b.x && a.y === b.y && a.z === b.z)
        )
        .subscribe((scale: IVector3) => {
          this.setState({
            scale,
          });
        });
    }

    if (this.rotSub === null) {
      const euler = new Euler(0, 0, 0, 'YXZ');
      this.rotSub = timer(0, 50)
        .pipe(
          switchMap(() => [this.props.selection]),
          map<ISceneNode, IVector3>((value: ISceneNode) => {
            euler.setFromQuaternion(value.quaternion);
            return { x: MathUtils.radToDeg(euler.x), y: MathUtils.radToDeg(euler.y), z: MathUtils.radToDeg(euler.z) };
          }),
          distinctUntilChanged((a: IVector3, b: IVector3) => a.x === b.x && a.y === b.y && a.z === b.z)
        )
        .subscribe((rotation: IVector3) => {
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

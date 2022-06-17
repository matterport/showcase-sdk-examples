import React, { Component } from 'react';
import {AddBox, IndeterminateCheckBox} from '@mui/icons-material';
import { TreeView, TreeItem } from '@mui/lab';
import { ISceneNode } from '@mp/common';
import styled from '@emotion/styled';


// /* tslint:disable-next-line: max-line-length */
// const minusPath = "M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z";
// /* tslint:disable-next-line: max-line-length */
// const plusPath = "M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z";

const MinusSquare = AddBox;//<SvgIcon></SvgIcon>;//(minusPath, 'MinusSquare');
const PlusSquare = IndeterminateCheckBox;//<SvgIcon></SvgIcon>;//(plusPath, 'PlusSquare');

const styles = {
  root: {
    flexGrow: 1,
    minWidth: 250,
    maxWidth: 264,
    height: '100%',
    overflowY: 'auto' as 'auto',
  },
  paper: {
    height: '100%',
    alignItems: 'stretch',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#BBBBBB',
  },
};
const PaperDiv = styled.div(styles.paper);

interface Props {
  scene: ISceneNode[];
  onSingleClick: (item: ISceneNode|null) => void;
  onDoubleClick: (item: ISceneNode|null) => void;
  selectionDeleted: (item: ISceneNode) => void;
  children: React.ReactNode;
}

interface State {
  selected: string;
}

export class SceneView extends Component<Props, State> {
  private selectedId = '';
  constructor(props: Props) {
    super(props);

    this.state = {
      selected: '',
    };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  private onKeyDown(event: React.KeyboardEvent, item: ISceneNode) {
    if (event.keyCode === 8 && this.props.selectionDeleted) {
      this.props.selectionDeleted(item);
    }
  }

  private onClick(event: React.MouseEvent, nodeId: string, item: ISceneNode) {
    let newNodeId = '';
    if (nodeId !== this.selectedId) {
      newNodeId = nodeId;
    }
    this.setState({
      selected: newNodeId,
    });
    
    if (newNodeId === nodeId) {
      this.props.onSingleClick(item);
    }
    else {
      this.props.onSingleClick(null);
    }

    this.selectedId = newNodeId;
  }

  private onDoubleClick(event: React.MouseEvent, nodeId: string, item: ISceneNode) {
    this.setState({
      selected: nodeId,
    });

    this.props.onDoubleClick(item);
  }

  public render() {
    let count = 0;
    const emitObject3D = (objects: ISceneNode[]) => {
      return objects.map((object) => {
        count++;
        const nodeId = count;
        return (
          <TreeItem
            nodeId={`${nodeId}`}
            key={`${nodeId}`}
            label={object.name}
            onKeyDown={(e) => this.onKeyDown(e, object)}
            onClick={(e) => this.onClick(e, `${nodeId}`, object)}
            onDoubleClick={(e) => this.onDoubleClick(e, `${nodeId}`, object)}
          ></TreeItem>
        );
      });
    };

    return (
      <PaperDiv>
        <TreeView
          sx={styles.root}
          defaultExpanded={['3']}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={['']}
          selected={this.state.selected}
        >
          {emitObject3D(this.props.scene)}
        </TreeView>
      </PaperDiv>
    );
  }
}

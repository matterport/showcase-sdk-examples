import React, { Component } from "react";
import Dropzone from 'react-dropzone';
import styled from '@emotion/styled';

const styles = {
  root: {
    width: '200px',
    height: '60px',
    marginLeft: '10px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#9dbd9d',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    textAlign: 'center' as 'center', // type cant be string.
    alignItems: 'center',
  },
  text: {
    margin: '12px',
  }
};
const RootDiv = styled.div(styles.root);
const TextP = styled.p(styles.text);
interface Props {
  cb: (serialized: string) => void;
}

export class SceneDropZone extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onDropHandler = this.onDropHandler.bind(this);
  }

  private onDropHandler(acceptedFiles: File[]) {
    const reader = new FileReader();
    reader.onload = async () => {
      console.log(reader.result);
      this.props.cb(reader.result as string);
    };

    reader.readAsText(acceptedFiles[0]);
  };

  render() {;
    return (
      <Dropzone onDrop={this.onDropHandler}>
        {({getRootProps, getInputProps}) => (
          <section>
            <RootDiv {...getRootProps()}>
              <input {...getInputProps()} />
              <TextP>Import scene files by dropping them here.</TextP>
            </RootDiv>
          </section>
        )}
      </Dropzone>
    );
  }
}

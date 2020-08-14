import React, { Component } from "react";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';

const styles = () => ({
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
});

interface Props extends WithStyles<typeof styles> {
  cb: (serialized: string) => void;
}

class SceneDropZoneImpl extends Component<Props> {
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

  render() {
    const classes = this.props.classes;
    return (
      <Dropzone onDrop={this.onDropHandler}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div className={classes.root} {...getRootProps()}>
              <input {...getInputProps()} />
              <p className={classes.text}>Import scene files by dropping them here.</p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

export const SceneDropZone = withStyles(styles, { withTheme: true })(SceneDropZoneImpl);

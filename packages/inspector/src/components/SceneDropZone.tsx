import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDropzone } from "react-dropzone";

const useStyles = makeStyles(theme => ({
  root: {
    width: '200px',
    height: '50px',
    margin: '10px',
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#9dbd9d',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  },
}));

export default function SceneDropZone(props: { cb: (serialized: string) => void}) {
  const onDropHandler = function(acceptedFiles: File[]) {
    const reader = new FileReader();
    reader.onload = async () => {
      console.log(reader.result);
      props.cb(reader.result as string);
    };

    reader.readAsText(acceptedFiles[0]);
  };

  const onDrop = React.useCallback(onDropHandler, []);

  const {isDragActive, getRootProps, getInputProps} = useDropzone({
    accept: 'application/json',
    onDrop,
  });

 const classes = useStyles({});
  return (
    <div className={classes.root} {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag scene files here</p>
      }
    </div>
  );
};

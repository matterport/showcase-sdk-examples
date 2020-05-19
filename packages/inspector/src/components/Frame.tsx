import * as React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  createStyles({
    root:  {
      width: '100%',
      alignItems: 'stretch',
      flexGrow: 1,
      height: '100%',
      marginLeft: '8px',
      marginRight: '8px',
    },
    frame: {
      height: '100%',
      width: '100%',
    }
  }),
);

export default function FrameView(props: {src: string}) {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <iframe id='sdk-iframe' className={classes.frame} src={props.src + '&title=0&qs=1&hr=0&brand=0&help=0'}></iframe>
    </div>
  );
}
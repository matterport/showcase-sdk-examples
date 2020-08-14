import React, { Component } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { IContext, IDialogUser } from '../interfaces';
import { AppContext } from '../AppContext';

const styles = () => ({
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
  },
});

interface Props extends WithStyles<typeof styles> {
  src: string;
};

interface State {
  user: IDialogUser|null;
}

class FrameViewImpl extends Component<Props, State> {
  context: IContext;
  static contextType = AppContext;

  constructor(props: Props){
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.context.frameOverlay.subscribe((user: IDialogUser) => {
      this.setState({
        user,
      });
    });
  }
  
  public render() {
    const { classes } = this.props;
    const { user } = this.state;

    return (
      <div className={classes.root}>
        { this.state.user && user.jsx()}
        <iframe id='sdk-iframe' className={classes.frame} src={this.props.src + '&title=0&qs=1&hr=0&brand=0&help=0'}></iframe>
      </div>
    );
  }
}

export const FrameView = withStyles(styles, { withTheme: true })(FrameViewImpl);

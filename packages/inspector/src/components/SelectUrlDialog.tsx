import React, { Component, RefObject, createRef } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import { IDialogUser } from '../interfaces';

const styles = () => ({
  dialog: {
    width: '400px',
  }
});

interface Props extends WithStyles<typeof styles> {
  user: IDialogUser|null;
};

class SelectUrlDialogImpl extends Component<Props> {
  private inputRef: RefObject<HTMLInputElement>;
  constructor(props: Props){
    super(props);

    this.inputRef = createRef<HTMLInputElement>();
    this.handleClose = this.handleClose.bind(this);
  }

  private handleClose(cancel: boolean) {
    if (this.props.user) {
      if (cancel) {
        this.props.user.onCancelled();
      }
      else {
        this.props.user.onComplete(this.inputRef.current.value);
      }
    }
  };

  public render() {
    const classes = this.props.classes;

    return (
      <Dialog
        open={this.props.user !== null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Select model url"}</DialogTitle>
        <DialogContent
          className={classes.dialog}
        >
          <TextField
            inputRef={this.inputRef}
            autoFocus
            margin="dense"
            id="name"
            label="Url Address"
            type="url"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => this.handleClose(false)} color="primary">
            Ok
          </Button>
          <Button onClick={(e) => this.handleClose(true)} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const SelectUrlDialog = withStyles(styles, { withTheme: true })(SelectUrlDialogImpl);

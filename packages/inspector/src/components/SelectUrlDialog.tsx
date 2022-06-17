import React, { Component, RefObject, createRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { IDialogUser } from '../interfaces';

const styles = {
  dialog: {
    width: '400px',
  }
};

interface Props {
  user: IDialogUser|null;
  children: React.ReactNode;
};

export class SelectUrlDialog extends Component<Props> {
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
    return (
      <Dialog
        open={this.props.user !== null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Select model url"}</DialogTitle>
        <DialogContent
          sx={styles.dialog}
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

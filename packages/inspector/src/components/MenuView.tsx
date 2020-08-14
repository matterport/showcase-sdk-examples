import React, { Component, createRef, MouseEvent } from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, Button } from '@material-ui/core';

const styles = (theme: Theme) => ({
  root:  {
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  popper: {
    zIndex: 100,
  },
  button: {
    textTransform: 'none' as 'none',
  }
});

interface State {
  open: boolean;
}

export interface IMenuItem {
  title: string;
  command: () => Promise<void>;
}

interface Props extends WithStyles<typeof styles> {
  title: string;
  items: IMenuItem[];
};

class MenuImpl extends Component<Props, State> {
  private buttonRef: React.RefObject<HTMLButtonElement>;

  constructor(props: Props){
    super(props);

    this.state = {
      open: false,
    };
    this.buttonRef = createRef<HTMLButtonElement>();
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleListKeyDown = this.handleListKeyDown.bind(this);
  }

  private handleToggle() {
    this.setState({
      open: !this.state.open,
    });
  }

  private handleSelect(event: MouseEvent<EventTarget>, menuItem: IMenuItem) {
    this.handleClose(event);
    menuItem.command();
  }

  private handleClose(event: MouseEvent<EventTarget>) {
    if (this.buttonRef.current && this.buttonRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    this.setState({
      open: false,
    });
  };

  private handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({
        open: false,
      });
    }
  }

  public render() {
    const { classes } = this.props;

    const items = this.props.items.map((item: IMenuItem) => {
      return <MenuItem onClick={(e: MouseEvent<EventTarget>) => this.handleSelect(e, item)} key={item.title}>{item.title}</MenuItem>;
    });

    return (
      <div className={classes.root}>
        <Button
          ref={this.buttonRef}
          className={classes.button}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          {this.props.title}
        </Button>
        <Popper
          className={classes.popper}
          open={this.state.open}
          anchorEl={this.buttonRef.current}
          role={undefined}
          transition
          disablePortal
          placement='bottom-start'
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList autoFocusItem={this.state.open} id="menu-list-grow" onKeyDown={this.handleListKeyDown}>
                    {items}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

export const MenuView = withStyles(styles, { withTheme: true })(MenuImpl);

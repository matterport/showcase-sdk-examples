import React, { Component, createRef, MouseEvent } from 'react';
import { Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, Button } from '@mui/material';
import styled from '@emotion/styled';

const styles = {
  root:  {
  },
  paper: {
    marginRight: '16px', // theme.spacing(2) originally
  },
  popper: {
    zIndex: 100,
  },
  button: {
    textTransform: 'none' as 'none',
  }
};
const RootDiv = styled.div(styles.root);
interface State {
  open: boolean;
}

export interface IMenuItem {
  title: string;
  command: () => Promise<void>;
}

interface Props {
  title: string;
  items: IMenuItem[];
};

export class MenuView extends Component<Props, State> {
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

  private handleSelect(event: MouseEvent | TouchEvent, menuItem: IMenuItem) {
    this.handleClose(event);
    menuItem.command();
  }

  private handleClose(event: any) {
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
    const items = this.props.items.map((item: IMenuItem) => {
      return <MenuItem onClick={(e: MouseEvent<HTMLElement>) => this.handleSelect(e, item)} key={item.title}>{item.title}</MenuItem>;
    });

    return (
      <RootDiv>
        <Button
          ref={this.buttonRef}
          sx={styles.button}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          {this.props.title}
        </Button>
        <Popper
          sx={styles.popper}
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
              <Paper sx={styles.paper}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList autoFocusItem={this.state.open} id="menu-list-grow" onKeyDown={this.handleListKeyDown}>
                    {items}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </RootDiv>
    );
  }
}

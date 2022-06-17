import React, { Component } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { ItemDesc } from '../types';

interface Props {
  items: ItemDesc[];
  onSelected?: (item: ItemDesc) => void;
}

export class ItemList extends Component<Props,{}> {
  constructor (props: Props){
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
  }

  onClick(event: React.MouseEvent) {
    if (this.props.onSelected) {
      for (const item of this.props.items) {
        if (item.name === event.currentTarget.textContent) {
          this.props.onSelected(item);
        }
      }
    }
  }

  render() {
    if (this.props.items.length === 0) {
      return null;
    }

    return (
      <div className='list-wrapper'>
        <List className='list'>
          {this.props.items.map((item: ItemDesc, index: number) => {
            return (
              <ListItem className= 'list-item' button key={index} onClick={this.onClick}>
                <ListItemText primary={item.name} onClick={this.onClick}/>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

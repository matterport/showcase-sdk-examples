import React, { Component } from 'react';

interface Props {
  src: string;
}

export class Frame extends Component<Props, {}> {
  render() {
    return (
      <div className='frame'>
        <iframe id='sdk-iframe' className='frame' src={this.props.src + '&title=0&qs=1&hr=0&brand=0&help=0'}></iframe>
      </div>
    );
  }
}

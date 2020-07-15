import React, { Component } from 'react';
import { ClientContext } from './Context';
import { IContext, Room } from 'rc-app/types';
import Table from 'rc-table';
import { ColumnsType, RenderedCell } from 'rc-table/lib/interface';

interface Props {
  message: string;
  onHostSelected?: (session: string) => void;
}

interface State {
  rooms: Room[];
}

export class SelectHost extends Component<Props, State> {
  context: IContext;
  static contextType = ClientContext;
  private columns: ColumnsType<Room>;

  constructor(props: Props) {
    super(props);

    this.state = {
      rooms: [],
    };
    this.onHostSelected = this.onHostSelected.bind(this);
    this.onRoomsUpdated = this.onRoomsUpdated.bind(this);

    this.columns = [
      {
        title: 'Room',
        dataIndex: 'name',
        key: 'name',
        width: 300,
        align: 'left',
      },
      {
        title: '',
        dataIndex: 'sid',
        key: 'sid',
        width: 50,
        render: (value: any, record: Room, index: number) => {
          const obj: RenderedCell<Room> = {
            children: [],
            props: {},
          };
    
          obj.children = <button type="button" className="select-host-join-button" onClick={() => this.onHostSelected(record)}>
            JOIN
          </button>
    
          return obj;
        },
      },
    ];
  }

  componentDidMount() {
    this.context.photonClient.events.on('rooms', this.onRoomsUpdated);

    this.setState({rooms: this.context.photonClient.rooms});
  }

  componentWillUnmount() {
    this.context.photonClient.events.off('rooms', this.onRoomsUpdated);
  }

  private onRoomsUpdated(rooms: Room[]) {
    this.setState({rooms});
  }

  onHostSelected(room: Room) {
    if (this.props.onHostSelected) {
      this.props.onHostSelected(room.name);
    }
  }

  render(): JSX.Element {
    return (
    <div className="select-host-container">
      <div>
        SELECT A HOST
      </div>
      <Table
        columns={this.columns}
        data={this.state.rooms}
        scroll={{y: 100 }}
        rowKey={(room: Room) => room.sid}
        rowClassName='select-host-row'
        className='select-host-table'
      />
      <div className="select-host-message">
        {this.props.message || ''}
      </div>
    </div>
    );
  }
}

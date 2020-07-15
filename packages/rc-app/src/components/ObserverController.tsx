import { waitUntil } from 'rc-app/PhotonClient';
import { ClientContext } from 'rc-app/components/Context';
import { IContext, ObservingState, Actor } from 'rc-app/types';
import React, { Component } from 'react';

import { Connecting } from './Connecting';
import { SelectHost } from './SelectHost';
import { IFrameOverlay } from './IFrameOverlay';

interface Props {
  onFinished?: () => void;
}

interface State {
  state: ObservingState;
  userCount: number;
  message?: string;
}

export class ObserverController extends Component<Props, State> {
  context: IContext;
  static contextType = ClientContext;
  private sid: string = null;
  private session: string = null;
  private room: Photon.LoadBalancing.Room = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      state: ObservingState.Connecting,
      userCount: 0,
      message: '',
    };

    this.onHostSelected = this.onHostSelected.bind(this);
    this.onStopObserving = this.onStopObserving.bind(this);
    this.onActorJoin = this.onActorJoin.bind(this);
    this.onActorLeave = this.onActorLeave.bind(this);
  }

  componentDidMount() {
    this.fetchRooms();
  }

  componentWillUnmount() {
    this.context.photonClient.disconnect();
  }

  async fetchRooms() {
    await this.context.photonClient.start();
    const rooms = this.context.photonClient.availableRooms();

    console.log(rooms);

    this.setState({
      state: ObservingState.SelectingHost,
    });
  }

  private onHostSelected(session: string) {
    this.session = session;
    this.connectToRoom();
  }

  private async connectToRoom() {
    this.context.photonClient.joinRoom(this.session);

    await waitUntil(() => this.context.photonClient.isJoinedToRoom());

    const room = this.context.photonClient.myRoom();
    this.room = room;
    this.sid = room.getCustomProperty("sid");

    this.context.photonClient.events.addListener('onActorJoin', this.onActorJoin);
    this.context.photonClient.events.addListener('onActorLeave', this.onActorLeave);

    this.setState({
      state: ObservingState.Observing,
      userCount: this.room.playerCount,
    });
  }

  private leaveRoom() {
    this.room = null;
    this.context.photonClient.events.removeListener('onActorLeave', this.onActorLeave);
    this.context.photonClient.events.removeListener('onActorJoin', this.onActorJoin);
    this.context.photonClient.leaveRoom();
  }

  private onStopObserving() {
    this.leaveRoom();
    if (this.props.onFinished) {
      this.props.onFinished();
    }
  }

  private onActorLeave(actor: Actor) {
    // cant call leaveRoom during onActorLeave callback.
    const host: number = this.room.getCustomProperty('host');
    if (actor.id === host) {
      console.log('host left, closing connection.');
      this.leaveRoom();
      this.setState({
        state: ObservingState.SelectingHost,
        message: 'Host left.',
      });
      return;
    }

    this.setState({
      userCount: this.room.playerCount,
    });
  }

  private onActorJoin(actor: Actor) {
    this.setState({
      userCount: this.room.playerCount,
    });
  }

  render(): JSX.Element {
    switch (this.state.state) {
      case ObservingState.Connecting:
        return <Connecting />;

      case ObservingState.SelectingHost:
        return <SelectHost onHostSelected={this.onHostSelected} message={this.state.message}/>;

      case ObservingState.Observing:
        return (
          <IFrameOverlay
            sid={this.sid}
            userCount={this.state.userCount}
            onStopped={this.onStopObserving}
            host={false}
          />
        );
    }
    return null;
  }
}

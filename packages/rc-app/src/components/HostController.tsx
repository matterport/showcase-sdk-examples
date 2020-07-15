import { waitUntil } from 'rc-app/PhotonClient';
import { ClientContext } from 'rc-app/components/Context';
import { HostingState, IContext } from 'rc-app/types';
import React, { Component } from 'react';

import { Connecting } from './Connecting';
import { SetModel } from './SetModel';
import { IFrameOverlay } from './IFrameOverlay';

interface Props {
  onFinished?: () => void;
}

interface State {
  state: HostingState;
  userCount: number;
  message?: string;
}

export class HostController extends Component<Props, State> {
  context: IContext;
  static contextType = ClientContext;
  private sessionName: string = '';
  private sid: string = '';
  private room: Photon.LoadBalancing.Room = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      state: HostingState.SelectingModel,
      userCount: 0,
    };

    this.onModelSet = this.onModelSet.bind(this);
    this.onStopHosting = this.onStopHosting.bind(this);
    this.onConnectedCountChanged = this.onConnectedCountChanged.bind(this);
  }

  async connect() {
    await this.context.photonClient.start();

    console.log(this.context.photonClient.availableRooms());

    for (const room of this.context.photonClient.availableRooms()) {
      if (room.name === this.sessionName) {
        if (room.masterClientId !== this.context.photonClient.myActor().actorNr) {
          console.warn('Client isnt room owner, cannot host');
          this.setState({
            state: HostingState.SelectingModel,
            message: 'Theres already a session by that name with a different host.'
          });
          return;
        }
      }
    }

    this.context.photonClient.joinRoom(this.sessionName, {
      createIfNotExists: true,
    });

    await waitUntil(() => this.context.photonClient.isJoinedToRoom());

    const room = this.context.photonClient.myRoom();
    console.log(room);

    const sidProperty = room.getCustomProperty('sid');
    if (sidProperty) {
      console.warn('room has been set to another sid');
    } else {
      room.setCustomProperty('sid', this.sid);
    }
    room.setCustomProperty('host', this.context.photonClient.myActor().actorNr);
    room.getCustomPropertyOrElse('host', this.context.photonClient.myActor().actorNr)
    this.room = room;

    this.context.photonClient.events.addListener('onActorJoin', this.onConnectedCountChanged);
    this.context.photonClient.events.addListener('onActorLeave', this.onConnectedCountChanged);

    this.setState({
      state: HostingState.Hosting,
      userCount: room.playerCount,
    });
  }

  private onModelSet(sid: string, session: string) {
    if (session === '') {
      this.setState({
        message: 'Cannot have empty session field.',
      });

      return;
    }

    if (sid === '') {
      this.setState({
        message: 'Cannot have empty sid field.',
      });

      return;
    }

    this.sid = sid;
    this.sessionName = session;
    console.log(this.sid);

    this.setState({
      state: HostingState.Connecting,
    });

    this.connect();
  }

  private onStopHosting() {
    this.room = null;
    this.context.photonClient.events.removeListener('onActorLeave', this.onConnectedCountChanged);
    this.context.photonClient.events.removeListener('onActorJoin', this.onConnectedCountChanged);
    this.context.photonClient.disconnect();
    this.props.onFinished();
  }

  private onConnectedCountChanged() {    
    this.setState({
      userCount: this.room.playerCount,
    });
  }

  render(): JSX.Element {
    switch (this.state.state) {
      case HostingState.Connecting:
        return <Connecting />;

      case HostingState.SelectingModel:
        return (
          <SetModel
            onModelSet={this.onModelSet}
            message={this.state.message}
          />
        );

      case HostingState.Hosting:
        return (
          <IFrameOverlay
            sid={this.sid}
            userCount={this.state.userCount}
            onStopped={this.onStopHosting}
            host={true}
          />
        );
    }
    return null;
  }
}

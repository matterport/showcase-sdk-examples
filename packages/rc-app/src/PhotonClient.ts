import { EventEmitter } from 'eventemitter3';

import { Event, Room, Actor } from './types';

export const onActorPropertiesChangedEvent = 'onActionChanged';

export class PhotonClient extends Photon.LoadBalancing.LoadBalancingClient {
  public events = new EventEmitter();
  public rooms: Room[] = [];

  constructor() {
    super(Photon.ConnectionProtocol.Wss, '738940b8-c549-4a4c-8ee6-9531e84d9dcc', '1.0');
    this.setLogLevel(Exitgames.Common.Logger.Level.INFO);
  }

  public async start() {
    if (this.isConnectedToMaster()) {
      return;
    }

    this.connectToRegionMaster('us');

    await waitUntil(() => this.state === Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby);
  }

  public onJoinRoom(createdByMe: boolean) {}

  // initial room list
  public onRoomList(rooms: Photon.LoadBalancing.RoomInfo[]) {
    this.rooms = rooms.map((room) => {
      const sid = room.getCustomProperty('sid');
      return {
        name: room.name,
        sid,
      };
    });
    this.events.emit('rooms', this.rooms);
  }

  public onMyRoomPropertiesChange(): void {}

  public onActorJoin(actor: Photon.LoadBalancing.Actor): void {
    this.events.emit('onActorJoin', {
      id: actor.actorNr,
    } as Actor);
  }

  public onActorLeave(actor: Photon.LoadBalancing.Actor, cleanup: boolean): void {
    this.events.emit('onActorLeave', {
      id: actor.actorNr,
    } as Actor);
  }

  // room list updates
  public onRoomListUpdate(rooms: Photon.LoadBalancing.RoomInfo[],
    roomsUpdated: Photon.LoadBalancing.RoomInfo[],
    roomsAdded: Photon.LoadBalancing.RoomInfo[],
    roomsRemoved: Photon.LoadBalancing.RoomInfo[])
  {
    this.onRoomList(rooms);
  }

  public onActorPropertiesChange(actor: Photon.LoadBalancing.Actor): void {
    this.events.emit(onActorPropertiesChangedEvent, actor);
  }

  public onEvent(code: number, content: Event, actorNr: number) {
    this.events.emit(content.type, content);
  }
}

export const waitUntil = (condition: () => boolean) => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId);
        resolve(undefined);
      }
    }, 30);
  });
};

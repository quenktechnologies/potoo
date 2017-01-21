import Message from './Message';

export class Event extends Message {}
export class ReceiveEvent extends Event {}
export class MessageEvent extends Event {}
export class MessageUnhandledEvent extends Event {}
export class MessageHandledEvent extends Event {}
export class MessageDroppedEvent extends Event {}
export class SelectHitEvent extends Event {}
export class SelectMissEvent extends Event {}
export class SelectFailedEvent extends Event {}

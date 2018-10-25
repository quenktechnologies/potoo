
Potoo
=====

Actor library for client and server side projects.

# Installation

```sh 
npm install --save @quenk/potoo

```
# Usage 

According to "Actor Model of Computation: Scalable Robust Information Systems":
"The Actor Model is a mathematical theory that treats “Actors” as the universal
primitives of digital computation." 

As far as this library is concerned, actors are a clean way to 
communicate between modules of a program through message passing.

Actors that communicate which each other are part of a system. To begin
using this library you have to create one. A single function `system` is
exported for this purpose:

## Example

```typescript

import {Immutable, Mutable, Case} from '@quenk/potoo/lib/actor/resident';
import {system} from '@quenk/potoo';

class Server extends Immutable<string> {

  receive = [

    new Case('connect', ()=> this.tell('client', 'connected')),

    new Case('time', ()=> this.tell('client', new Date())),

    new Case('close', ()=> this.tell('client', 'bye!'))

  ]

}

class Client extends Mutable<string> {

  receive = [
  
    new Case('start', ()=> this.connect())
  
  ]

  connecting = [

    new Case('connected', ()=> 
      this
        .tell('server', 'time')
        .select(this.connected))

  ]

  connected = [

    new Case(Date, (d:date)=> {
      
      console.log(`Today is ${d}.`);

      this
        .tell('server', 'close')
        .select(connected);

    }),
    
  ]

  connect() {

    this
    .tell('server', 'connect')
    .select(this.connecting);

  }

}

//start the system and spawn the actors
system({log:{level:8}})
.spawn({id: 'server', s => new Server(s)})
.spawn({id: 'client', s => new Client(s)})

```

# License

Apache-2.0 (C) Quenk Technologies Limited


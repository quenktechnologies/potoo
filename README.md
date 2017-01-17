
Potoo
=====

An actor model implementation for JavaScript.

Requires an ES2015+ environment, see [babel polyfill](https://babeljs.io/docs/usage/polyfill). 

## Background

According to "Actor Model of Computation: Scalable Robust Information Systems"
by Carl Hewitt: "The Actor Model is a mathematical theory that treats “Actors” as the universal
primitives of digital computation."

For programmers, it's a method for treating with concurrent computation by making
use of message passing and addressing.

This library started out as an experiment to tackle communication between
UI components in Single Page Appliactions (SPA) where the future requirments
for such are unknown. The more 'intelligent' we try to make SPAs the more
complicated the communication can become.

Conventions such as EventEmitters, Observers, callback etc. work in the short run as
they let us setup communication channels in an adhoc fashion however
as the application grows it can be difficult to determine which
function or class handles what event at a given point in runtime.

The actor model allows us to cleanly seperate all our application concerns and only 
communicate via a common contract. Concerns within the application are 
called actors and the application can be seen as a system these actors belong to.

Rather than calling methods on other actors, actors only interact directly with 
their own private state, communication between actors occurs through message passing
through a common interface all actors satisfy.

Upon receiving a message, an actor can do one of three things:

* send messages to another actor.
* create a new actor.
* change the way it will handle the next message.

This library was influenced first by the Akka framework and later Erlang/OTP.
Messages are received simillar to Erlang's receive expression and we provide
some functions for pattern matching before a message is handled.

##Installation

```sh 
npm install --save potoo
```

##Usage

Start by creating a new system for your Actors somewhere:

```js
import {IsomorphicSystem} from 'potoo';

var sys = IsomorphicSystem.create();

```

### Creating Actors

An actor is just a function that is bound to a Context. The Context
provides a method 'receive' that is used to process the next message 
from the actor's mailbox.

The receive method accepts a function which will 
be applied to the next message in the mailbox. This can be seen as the actors
current behaviour. Once the function handles a message, it is removed
from the internal stack.

The contract of receive is that it returns a Promise for the value of the
function once applied to a valid message. Error handling
on this Promise is done internally so calling `Promise#catch` is not necesary.

If the value returned from the function is `null` or `undefined`, that message
is considered 'unhandled' and is dropped by the actor. If the value is a 
`Thenable` then the next call to `receive` is handled.

```js

function log() {

  return this.receive(function(message){

       console.log(message);

 });

}

function produce() {

  setInterval(()=> this.select('/log').tell('hello'), 100);

}

var logger = sys.spawn({start:log}, 'logger');
var producer = sys.spawn({start:produce}, 'producer');

```

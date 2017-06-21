
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

Coming soon.
``

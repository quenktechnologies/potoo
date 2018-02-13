
Potoo
=====

Server and client side actors for ~~JavaScript~~ TypeScript.

#Installation

```sh 
npm install --save potoo

```
# Background

According to "Actor Model of Computation: Scalable Robust Information Systems"
by Carl Hewitt: "The Actor Model is a mathematical theory that treats “Actors” as the universal
primitives of digital computation." As far as this module is concerned; 
it's an approach for managing concurrent computation through the use of message passing.

This module started off with the goal of making cross-communication easier
between the various components of front-end applications. The actor model
allows each component to maintain its own private state and not be 
concerened with the details of other components. If one component
wants to communicate with another, it sends a message and hopes for the best
rather than calling a method on class or interface somewhere else in the code base.

This is true separation of concerns.

What the actor model actor model excels at perhaps more tmore than anything is not so much
concurrent computation but rather communication. Communication between modules
of code is very important to maintainability but is easily overlooked due to it
being implicit (method calling etc.). 

By using actors, communication becomes explicit and is therefore easier
to track down. In order to communicate with another actor, an actor
must have an address for that actor and can (should) only send messages
through the machinery provided by the underlying system. 

Potoo was orginally inspired by the Akka framework and later the Erlang/OTP
framework. Due to this influence, there is a concept of mailboxes where messages
are stored before being processed.

According to the actor model axioms, upon receiving a message, an actor can do one of three 
things:

* Send a message(s) to another actor.
* Create a new actor.
* Change the way it will handle the next message.

The above is not exclusive and any combination of the above combined with the internal side-effects
of processing a received message for the computation of an actor. Of course in an ideal world,
side-effects would be isolated to other actors.

# Design

## The System

The starting point for establishing a potoo actor system is the creation of the system itself.
This is done through the `System#create` method which accepts a configuration object and returns
a new system instance.

There SHOULD be only one instance of a system per runtime. All messages pass through the system
before reaching their destination. This design was chosen to allow messages to be 
monitored which is crucial for debugging.

### Logging

The system has a replaceble logger. By default, events are logged to `STDIN` or 
the JavaScript console. There are a number of pre-defined events that occur during the 
life-cycle of the system and its child actors. These events are automatically
observed and logged. 
They include:

* ChildSpawnedEvent - Indicates an actor has spawned a new child.
* MessageSentEvent - Indicates a message has been sent from one actor towards another.
* MessageDroppedEvent - Indicates a message failed to reach its destination or was discarded.
* MessageAcceptedEvent - Indicates a message was accepted into an actor's mailbox.
* MessageReceivedEvent - Indicates an actor received an event for processing.
* MessageRejectedEvent - Indicates a message was completely refused.
* ReceiveStartedEvent  - Indicates an actor began receiving events.
* SelectStartedEvent - Indicates an actor has began selectively receiving events.
* ActorRemovedEvent - Indicates an actor has been removed from the system.

## Actors

Potoo actors can be divided into roughly two categories, local and foreign.

### Local Actors
Local actors are those actors that share the same JS runtime. They are created using the 
primitives provided in the [actors](src/actors) submodule.
Due to these actors existing in the same JS event loop, concurrency is limited to
whatever the runtime already supports. 

### Foreign Actors

The ultimate goal of potoo is to be able to spawn hundreds to thousands of actors without
concern for where they are located. That is, location transparency. An actor could be a module
loaded into the current runtime, a nodejs process, a web worker, a green thread or 
another actor system running on a remote machine.

To achieve this, implementation of each is left up to external modules. The system only
requires the actors created by these modules to support the common `Actor` interface.

### The Common Actor Interface

The common interface allows the system to manage as well as deliver messages to actors.
The interface MUST provide for:
1. Starting the actor.
2. Accepting messages.
3. Stopping the actor.
4. Running system commands.
5. Error handing.

These are covered by the `run()`, `accept()`, `stop()` and `runCommand()` methods respectively.

**TODO**: Support error handling.

### Messages
Due to the origins in client side development, message types are typically JSON structures, class instances
or JS primitives. 

Nothing prevents an actor from sending say a node `Buffer` to another however the treatment of
such is dependant on the type of actor implementation spawned. A local actor will of course see the same instance of `Buffer` where as some remote implementation may treat the message as a byte array.

In general however implementations SHOULD recognize the type in the corresponding format and 
MUST maintain the integrity of the underlying data.

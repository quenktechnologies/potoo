Potoo
=====

In application message passing system inspired by the actor model.

[!Diagram of Potoo internals](v3.png)

# Introduction

Potoo provides a framework for constructing an actor system within frontend or
backend applications.

It is implemented as a virtual machine (PVM) that is usually embeded into the 
main class of an application. PVM is used to spawn child "actors" that each 
execute some unit of work on behalf of the application. Actors are able to 
communicate with each other via message passing.

Actors can either be "resident" or "remote". Resident actors share the JS event
loop with the VM and use its API to execute message passing instructions. Remote
actors that do not share the event loop and can be in another process or even
another machine.

The [API](src/resident/index.ts) interface describes the methods available to
resident actors. Extend the `Immutable` or `Mutable` classes to create an 
implementation or `AbstractResident` if you need more customisation.

Currently the only remote actors supported are [Process](src/actor/process/index.ts)
which uses the Node.js child_process API to run a separate `PVM` instance.

There are plans however to support web sockets, web workers and possibly green
thread actors.

# Installation

```sh 
npm install --save @quenk/potoo
```

# Usage

Consult the tests folder for now.

# License

Apache-2.0 (C) 2022 Quenk Technologies Limited

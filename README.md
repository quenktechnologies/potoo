Potoo
=====

In app message passing framework inspired the actor model.

# Introduction

Potoo provides a framework for creating a network of actors within your 
applications for easy message passing.

## Why?

Message passing allows us to de-couple our applications and thus scale more
effectively. This is true for traditional networks and distributed computing
but it can also be applied to the UI components of an ordinary web app.

## How?

This framework allows you to create 1 or more actors that together form a system.
Behind the scenes, the framework provides machinery to deliver messages to and
from actors given the respective address.

Think of an actor as a unit of computation or the refinement of a feature within
your application. Each actor has its own state that it does not share with other
actors, instead they communicate via messages.

When an actor receives a message, it can typically:
1. Spawn a new actor to handle the message.
2. Change it's internally behaviour based on the contents of the message.
3. Send a message to another actor.

By honoring these 3 points we are able to distribute the work of our applications
in a scalable way, without the complexity.

# Installation

```sh 
npm install --save @quenk/potoo
```

# Usage

```js
import { PVM } from '@quenk/potoo';

// This is your system and serves as the root actor.
let vm = PVM.create();

vm.spawn({

    id: 'a', 

    run: async actor => {

        await actor.tell('b', 'ready');

        while(actor.isValid()) {
            let msg = await actor.receive();
            if(msg === 'done') {
              await actor.exit();
            }
        }
    }
})

vm.spawn({
    id: 'b',

    run: async actor => {

        setTimeout(()=> { actor.tell('a', 'done'); }, 5000);

    }
})


```

More examples in the test folder.


# License

Apache-2.0 (C) 2024 Quenk Technologies Limited

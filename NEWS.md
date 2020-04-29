# 2020-04-29

## Tell Can Be Immediate.

One of the things to look out for in the 3 branch is the change in the 
behaviour of the `AbstractResident#tell` method. Previously, this was 
guaranteed to occur in "the next tick", meaning you could send a message to
an actor before you actually spawn it.

This may have been desirable in some situations but one of the ultimate goals
of potoo is to minimize overhead in message delivery as much as possible.
With this in mind, messages are delivered instantly to actors (or their mailbox)
as soon as you send them. Processing of those messages however are subject
to system load (notify() scripts may be queued) or the implementation of the
`accept()` method.

# 2020-04-25

After some review, spawn() and tell() must be synchronous. If they are not,
then using these APIs will be messy. Imagine each spawn() or tell() returning 
a Future.

Now that we want to support async run() and stop(), having an async spawn or
async tell() can cause a deadlock as the parent run()/stop() awaits the 
spawn() or tell() etc. script to complete. The spawn() or tell() script won't
even run because it has to wait on the run() script to complete before being 
executed!

Furthermore, currently we manufacture an address for spawned actors before they
are actually part of the system. The consequence of that is, messages sent
immediately to that address would always be lost until the actor appears.

To avoid all this the execute immediately feature needs to be kept. This time 
however, it's separate from the regular exec() method.

# 2020-04-20

Backtracked on the idea to allow immediate and queued scripts. Instead, ALL
scripts are queued before execution. Things were getting messy trying to balance
between the two.

In a future revision we may return Futures or provide callbacks to get results
from script execution. For now it's silently discarded.


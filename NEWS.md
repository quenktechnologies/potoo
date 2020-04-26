
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


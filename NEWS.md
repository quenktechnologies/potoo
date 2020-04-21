
# 2020-04-20

Backtracked on the idea to allow immediate and queued scripts. Instead, ALL
scripts are queued before execution. Things were getting messy trying to balance
between the two.

In a future revision we may return Futures or provide callbacks to get results
from script execution. For now it's silently discarded.


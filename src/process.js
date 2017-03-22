import { System, ParentT } from './Actor';

new System()
    .spawn(new ParentT({ id: '?' }))
    .start()
    .run();

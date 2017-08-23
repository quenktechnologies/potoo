import * as potoo from 'potoo';
import { Actor } from 'potoo';

const PACE = 5;
const MAX_PACE = '90%';
const MIN_PACE = '0%';

/* helper functions */
const left = (handle: HTMLElement): string => handle.style.left;

const per2num = (v: string): number => Number(v.split('%')[0]);

const num2per = (v: number): string => `${v}%`;

class Player extends Actor.Static<KeyboardEvent>{

    receive = new potoo.Case(KeyboardEvent, (e: KeyboardEvent) => {

        if (e.keyCode === 37)
            this.getPlayer().style.left = this.moveLeft(<HTMLElement>e.target);
        else if (e.keyCode === 39)
            this.getPlayer().style.left = this.moveRight(<HTMLElement>e.target);
        else
            console.log(`ignored key code ${e.keyCode}`);

    })

    constructor(s: potoo.System, public id: string) { super(s); }

    getEntity(id: string): HTMLElement {

        return document.getElementById(id);

    }

    getPlayer(): HTMLElement {

        return this.getEntity(this.id);

    }

    moveRight(handle: HTMLElement): string {

        return (left(handle) !== MAX_PACE) ?
            handle.style.left = num2per(per2num(left(handle)) + PACE) : null;
    }

    moveLeft(handle: HTMLElement): string {

        return (left(handle) !== MIN_PACE) ?
            handle.style.left = num2per(per2num(left(handle)) - PACE) : null;

    }

    run() {

        window.onkeydown = e => this.tell(this.id, e);

    }

}

potoo
    .System
    .create()
    .spawn({ id: 'player', create: s => new Player(s, 'player') })
    .spawn({ id: 'clone', create: s => new Player(s, 'clone') }); 

import { System } from 'potoo/lib/System';
import { LocalActor, Template } from 'potoo/lib/LocalActor';
import { LocalContext } from 'potoo/lib/LocalContext';
import { MatchAny } from 'potoo/lib/Behaviour';

const PACE = 5;
const MAX_PACE = '90%';
const MIN_PACE = '0%';

/* helper functions */
const left = (handle: HTMLElement): string => handle.style.left;

const per2num = (v: string): number => Number(v.split('%')[0]);

const num2per = (v: number): string => `${v}%`;

class Player extends LocalActor {

    constructor(public id: string, public ctx: LocalContext) {

        super(ctx);

    }

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

    monitorKeys(e) {

        if (e.keyCode === 37)
            this.getPlayer().style.left = this.moveLeft(e);
        else if (e.keyCode === 39)
            this.getPlayer().style.left = this.moveRight(e);
        else
            console.log(`ignored key code ${e.keyCode}`);

        this.receive(m => this.monitorKeys(m));

    }

    run() {

        window.onkeydown = e => this.tell(this.id, e);
        this.receive(m => this.monitorKeys(m));

    }

}

System
    .create()
    .spawn(Template.from('player', ctx => new Player('player', ctx)))
    .spawn(Template.from('clone', ctx => new Player('clone', ctx)));

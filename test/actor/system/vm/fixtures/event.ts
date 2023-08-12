import { Type } from '@quenk/noni/lib/data/type';

import { Mock } from '@quenk/test/lib/mock';

import { 
  EventName,
  EventSource, 
  Handler 
} from '../../../../../lib/actor/system/vm/event';
import { Address } from '../../../../../lib/actor/address';

export class EventSourceImpl implements EventSource {

    mock = new Mock();

    on(evt: EventName, handler: Handler) {

        return this.mock.invoke('on', [evt, handler], undefined);

    }

    publish(addr: Address, evt: string, ...args: Type[]) {

        return this.mock.invoke('publish', [addr, evt, ...args], undefined);

    }

}

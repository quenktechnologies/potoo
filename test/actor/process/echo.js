const Immutable = require('../../../lib/actor/resident').Immutable;
const Case = require('../../../lib/actor/resident/case').Case;

class Echo extends Immutable {

    constructor(s) {

        super();

        this.system = s;

    }

    receive() {

        return [

            new Case({ client: String, message: String },
                p => { this.tell(p.client, p.message); })

        ];

    }

}

module.exports.create = s => new Echo(s);

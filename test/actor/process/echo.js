const Immutable = require('../../../lib/actor/resident').Immutable;
const Case = require('../../../lib/actor/resident').Case;

function Echo (s) {

    this.system = s;

    this.receive = [

        new Case({client:String, message:String},
            p => this.tell(p.client, p.message))

    ];

  return Immutable.apply(this, [s]);

}

Echo.prototype = Object.create(Immutable.prototype);

module.exports.create = s => new Echo(s);

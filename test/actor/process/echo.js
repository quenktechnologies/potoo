const Immutable = require('../../../lib/actor/resident').Immutable;
const Case = require('../../../lib/actor/resident/case').Case;

function Echo (s) {

    this.system = s;

    receive = ()=> [

        new Case({client:String, message:String},
            p => { this.tell(p.client, p.message) })

    ];

  return Immutable.apply(this, [s]);

}

Echo.prototype = Object.create(Immutable.prototype);

Echo.prototype.run = () =>{}

module.exports.create = s => new Echo(s);

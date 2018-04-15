'use strict';

const System = require('./System');

const system = new System(10);

system.setFullQuorumSetForAllNodes();
system.startAllNodes();
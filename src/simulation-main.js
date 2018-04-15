'use strict';

const NetworkModel = require('./NetworkModel');

const network = new NetworkModel(10);

network.setFullQuorumSetForAllNodes();
network.startAllNodes();
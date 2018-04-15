'use strict';

const System = require('./System');
const { timeout } = require('./utils');

const system = new System(10);

system.setFullQuorumSetForAllNodes();
system.startAllNodes();

test1();
printStatus();

async function test1() {
  await timeout(1500);
  system.nodes[4].nominate('3');
}

async function printStatus() {
  while(true) {
    await timeout(1000);
    system.printNodesStatusString();
  }
}

'use strict';

const System = require('./System');
const { timeout } = require('./utils');

test();

async function test() {
  const system1 = new System(10, 'System1');
  console.log(system1.name + ': started!');
  system1.setFullQuorumSetForAllNodes();
  system1.startAllNodes();
  trigger(system1, 1500, 4, '3');
  await printStatus(system1);

  const system2 = new System(10, 'System2');
  console.log(system2.name + ': started!');
  system2.setHalfQuorumSetForAllNodes();
  system2.startAllNodes();
  trigger(system2, 1300, 7, 'k');
  await printStatus(system2);

  console.log('All test simulation finished!');
  process.exit(0);
}

async function trigger(sys, delay, nodeID, value) {
  await timeout(delay);
  sys.nodes[nodeID].nominate(value);
}

async function printStatus(sys) {
  let iterations = 4;
  while(iterations > 0) {
    await timeout(800);
    sys.printNodesStatusString();
    iterations--;
  }
  console.log(sys.name + '1: terminated!');
  sys.destroy();
}

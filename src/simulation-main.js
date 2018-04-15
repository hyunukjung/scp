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

  // Show system may hang.
  const system2 = new System(10, 'System2');
  console.log(system2.name + ': started!');
  system2.setHalfQuorumSetForAllNodes();
  system2.startAllNodes();
  trigger(system2, 800, 7, 'k');
  await printStatus(system2);

  const system3 = new System(7, 'System3');
  console.log(system3.name + ': started!');
  system3.nodes[0].updateQuorumSet([0, 1, 2, 3, 4, 5]);
  system3.nodes[1].updateQuorumSet([0, 1, 3, 4, 5]);
  system3.nodes[2].updateQuorumSet([1, 2, 3, 5, 6]);
  system3.nodes[3].updateQuorumSet([3, 4, 5, 6]);
  system3.nodes[4].updateQuorumSet([1, 3, 4]);
  system3.nodes[5].updateQuorumSet([0, 1, 2, 3, 5]);
  system3.nodes[6].updateQuorumSet([2, 3, 6]);
  system3.startAllNodes();
  trigger(system3, 800, 5, 'k');
  await printStatus(system3);

  console.log('All test simulation finished!');
  process.exit(0);
}

async function trigger(sys, delay, nodeID, value) {
  await timeout(delay);
  sys.nodes[nodeID].nominate(value);
}

async function printStatus(sys) {
  let iterations = 10;
  while(iterations > 0) {
    await timeout(300);
    sys.printStatus();
    iterations--;
  }
  console.log(sys.name + '1: terminated!');
  sys.destroy();
}

'use strict';

const { timeout } = require('./utils');

class LocalNode {
  constructor(nodeID) {
    this.nodeID = nodeID;
  } 

  updateQuorumSet(newQuorumSet) {
    this.quorumSet = newQuorumSet;
  }

  async start() {
    while(true) {
      await timeout(1000);
      this.tick();
    }
  }

  tick() {
    console.log(`Node [${this.nodeID}]: tick()`);
  }
}

module.exports = LocalNode;
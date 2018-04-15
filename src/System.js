'use strict';

const LocalNode = require('./LocalNode');

class System {
  constructor(nodeSize) {
    this.size = nodeSize;
    this.nodes = [];
    for (let i = 0; i < nodeSize; i++) {
      this.nodes.push(new LocalNode(this, i));
    }
  }

  setFullQuorumSetForAllNodes() {
    const fullQuorumSet = [];
    for (let i = 0; i < this.size; i++) {
      fullQuorumSet.push(i);
    }
    for (let i = 0; i < this.size; i++) {
      this.nodes[i].updateQuorumSet(fullQuorumSet.slice(0));
    }
  }

  startAllNodes() {
    for(let i = 0; i < this.size; i++) {
      this.nodes[i].start();
    }
  }

  sendMsg(to, msg) {
    this.nodes[to].processMsg(msg);
  }
}

module.exports = System;
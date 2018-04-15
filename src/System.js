'use strict';

const LocalNode = require('./LocalNode');
const { timeout } = require('./utils');

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

  async sendMsg(to, msg) {
    await timeout(50);
    this.nodes[to].processMsg(msg);
  }

  printNodesStatusString() {
    let s = '';
    for (const node of this.nodes) {
      s += node.getStatusString();
    }
    console.log('System Status: ' + s);
  }
}

module.exports = System;
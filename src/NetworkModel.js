'use strict';

const LocalNode = require('./LocalNode');

class NetworkModel {
  constructor(nodeSize) {
    this.size = nodeSize;
    this.nodes = [];
    for (let i = 0; i < nodeSize; i++) {
      this.nodes.push(new LocalNode(i));
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

  sendMsg(from, to, msg) {
    this.nodes[to].onMsg(from, msg);
  }
}

module.exports = NetworkModel;
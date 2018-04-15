'use strict';

const LocalNode = require('./LocalNode');
const { timeout } = require('./utils');

class System {
  constructor(nodeSize, name = 'System') {
    this.name = name;
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

  setHalfQuorumSetForAllNodes() {
    for (let i = 0; i < this.size; i++) {
      const quorumSet = [];
      for(let j = i; j <= i + this.size / 2; j++) {
        quorumSet.push(j % this.size);
      }
      this.nodes[i].updateQuorumSet(quorumSet);
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

  getSystemWideStatus() {
    let value = null;
    let status = 'Unknown';

    for (const node of this.nodes) {
      if (node.slots[1] && node.slots[1].nominationState) {
        const state = node.slots[1].nominationState;
        if (state.y) {
          if (value === null) {
            value = state.y;
          }
          if (value === state.y) {
            status = 'Agreed ';
          } else {
            status = 'Stuck  ';
          }
        }
      }
    }
    return status;
  }

  printStatus() {
    let s = '';
    for (const node of this.nodes) {
      s += node.getStatusString();
    }
    const st = this.getSystemWideStatus();
    console.log(`Status: ${st}, Nodes: ${s}`);
  }

  destroy() {
    for (let i = 0; i < this.nodes.length; i++) {
      delete this.nodes[i];
    }
    delete this;
  }
}

module.exports = System;
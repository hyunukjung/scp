'use strict';

const Slot = require('./Slot');
const { timeout } = require('./utils');

class LocalNode {
  constructor(system, nodeID) {
    this.system = system;
    this.nodeID = nodeID;
    this.slots = [];
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

  getSlot(slotNum) {
    if (!this.slots[slotNum]) {
      this.slots[slotNum] = new Slot(this, slotNum);
    }
    return this.slots[slotNum];
  }

  propose(value, slotNum = 1) {
    // value: string
    const slot = this.getSlot(slotNum);
    slot.propose(value);
    const msg = slot.getPrepareMsg();
    this.sendMsg(msg);
  }

  sendMsg(msg) {
    for (const node of this.quorumSet) {
      this.system.sendMsg(node, msg);
    }
  }

  processMsg(msg) {
    const slot = this.getSlot(msg.slotIndex);
    slot.processMsg(msg);
  }
}

module.exports = LocalNode;
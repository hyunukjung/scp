'use strict';

const Slot = require('./Slot');
const { timeout } = require('./utils');

class LocalNode {
  constructor(system, nodeID) {
    this.system = system;
    this.nodeID = nodeID;
    this.slots = [];
    this.quorumSet = [];
  } 

  updateQuorumSet(newQuorumSet) {
    this.quorumSet = newQuorumSet;
  }

  cloneQuorumSet() {
    return this.quorumSet.slice(0);
  }

  async start() {
    while(true) {
      await timeout(1000);
      this.tick();
    }
  }

  tick() {
    // console.log(`Node${this.nodeID}: tick()`);
  }

  getSlot(slotIndex) {
    if (!this.slots[slotIndex]) {
      this.slots[slotIndex] = new Slot(this, slotIndex);
    }
    return this.slots[slotIndex];
  }

  nominate(value, slotIndex = 1) {
    // value: string
    const slot = this.getSlot(slotIndex);
    slot.nominate(value);
  }

  sendMsg(msg, to = null) {
    if (to) {
      this.system.sendMsg(to, msg);
      return;
    }

    // Otherwise, broadcast!
    for (const node of this.quorumSet) {
      this.system.sendMsg(node, msg);
    }
  }

  processMsg(msg) {
    const slot = this.getSlot(msg.slotIndex);
    slot.processMsg(msg);
  }

  getStatusString() {
    // Assumes single slot (index == 1)
    const singleSlot = this.slots[1];
    if (singleSlot) {
      return this.nodeID + singleSlot.getStatusString();
    } else {
      return this.nodeID + '---';
    }
  }
}

module.exports = LocalNode;
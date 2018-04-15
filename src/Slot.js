'use strict';

function getNilBallot() {
  return { counter: 0, value: null };
}

class Slot {
  constructor(localNode, slotIndex) {
    this.phase = 'PREPARE';
    this.localNode = localNode;
    this.slotIndex = slotIndex;
    this.b = getNilBallot();
    this.p = getNilBallot();
    this.p_ = getNilBallot();
    this.h = getNilBallot();
    this.c = getNilBallot();
  }

  propose(value) {
    this.b.counter += 1;
    this.b.value = value;
  }

  getPrepareMsg() {
    const msg = { 
      nodeID: this.localNode.nodeID,
      slotIndex: this.slotIndex,
      type: 'PREPARE',
      prepareMsg: {
        ballot: Object.assign({}, this.b),
        prepared: Object.assign({}, this.p),
        preparedPrime: Object.assign({}, this.p_),
        hCounter: this.h.counter,
        cCounter: this.c.counter,
      },
      quorumSet: this.localNode.cloneQuorumSet(),
    };
    return msg;
  }

  processMsg(msg) {
    const nodeID = this.localNode.nodeID;
    console.log(`Node${nodeID}: process msg from Node${msg.nodeID}`);
  }
}

module.exports = Slot;
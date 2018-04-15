'use strict';

const NominationState = require('./NominationState');
const BallotState = require('./BallotState');

class Slot {
  constructor(localNode, slotIndex) {
    this.phase = 'NOMINATE';
    this.localNode = localNode;
    this.slotIndex = slotIndex;
    this.nominationState = new NominationState(localNode, slotIndex);
    this.ballotState = new BallotState(localNode, slotIndex);
  }

  nominate(value) {
    // NOTE: only a single value can be nominated in this system.
    // value: string
    this.nominationState.nominate(value);
  }

  processMsg(msg) {
    const nodeID = this.localNode.nodeID;
    // console.log(`Node${nodeID}: process msg from Node${msg.nodeID}`);
    const from = msg.nodeID;

    if (msg.type === 'NOMINATE') {
      if (this.phase === 'NOMINATE') {
        this.nominationState.processMsg(msg);
      } else {
        console.log(`Node${nodeID}: ignoring nominate msg since this moved to ballot phase.`);
      }
      return;
    } else {
      if (this.phase === 'NOMINATE') {
        this.nominationState.processMsg(msg);
        this.phase === 'PREPARE';
      }
      this.ballotState.processMsg(msg);
    }
  }

  getStatusString() {
    if (this.phase === 'NOMINATE') {
      return this.nominationState.getStatusString();
    }
    return this.ballotState.getStatusString();
  }
}

module.exports = Slot;
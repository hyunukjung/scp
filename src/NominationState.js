'use strict';

class NominationState {
  constructor(localNode, slotIndex) {
    this.localNode = localNode;
    this.slotIndex = slotIndex;

    // Only a single value can be nominated in this system.
    // So, voted (accepted) can be a string value or null. 
    this.x = null;  // voted value
    this.y = null;  // accepted value
    this.z = null;  // candidate value of this node
    this.N = [];  // nominate messages from each node
    this.confirmed = false;
  }

  // NOTE: this.z <= value
  nominate(value) {
    if (this.z === null) {
      this.z = value;
    } else if (this.z === value) {
      // OK! no conflict.
    } else {
      // WAIT! can nominate confliting value here?
      console.log('Ignore nominate command!');
      return;
    }
    this.voteOrAccept();
  }

  voteOrAccept() {
    let needToSend = false;
    if (this.x === null && this.y === null && this.z) {
      this.x = this.z;
      needToSend = true;
    }

    let countVotedOrAccepted = 0;
    let countAccepted = 0;
    for (const key in this.N) {
      const msg = this.N[key];
      const value = msg.x || msg.y;
      if (value === this.z) {
        countVotedOrAccepted++;
      }
      if (msg.y === this.z) {
        countAccepted++;
      }
    }

    if (!this.y) {
      // NOTE: assuming that threshold == quorumSet.length
      if (countVotedOrAccepted >= this.localNode.quorumSet.length) {
        this.x = null;
        this.y = this.z;
        needToSend = true;
      }
    }

    if (countAccepted >= this.localNode.quorumSet.length) {
      this.confirmed = true;
      console.log(`Node${this.localNode.nodeID}: nominated confirmed!`);
    }

    if (needToSend) {
      this.localNode.sendMsg(this.getNominateMsg());
    }
  }

  getNominateMsg() {
    const msg = {
      nodeID: this.localNode.nodeID,
      slotIndex: this.slotIndex,
      type: 'NOMINATE',
      x: this.x,
      y: this.y,
      quorumSet: this.localNode.cloneQuorumSet(),
    };
    return msg;
  }

  processMsg(msg) {
    const nodeID = this.localNode.nodeID;
    const from = msg.nodeID;
    // console.log(`Node${nodeID}: process nominate msg from ${from}`);

    if (this.z === null) {
      this.z = msg.x || msg.y;
      // console.log(`Node${nodeID}: initialize nominate value: ${this.z}`);
    }
    if (this.localNode.quorumSet.includes(from)) {
      this.N[msg.nodeID] = msg;
    }

    if (nodeID === from) {
      // skip if msg from self
      return;
    }
    this.voteOrAccept();
  }

  getStatusString() {
    const s = this.confirmed ? 'C' : this.y ? 'A' : this.x ? 'V' : this.z ? 'I' : '-'; 
    return s + (this.z || '-') + '-';
  }
}

module.exports = NominationState;
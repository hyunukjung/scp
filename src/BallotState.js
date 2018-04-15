'use strict';

function getNilBallot() {
  return { counter: 0, value: null };
}

function isNew(current, latest) {
  if (!latest) {
    return true;
  }
  if (current.type !== latest.type) {
    // statement type (PREPARE < CONFIRM < EXTERNALIZE)
    if (current.type === 'PREPARE') {
      return false;
    }
    if (current.type === 'EXTERNALIZE') {
      return true;
    }
    // current.type === 'CONFIRM'
    return (latest.type === 'PREPARE');
  }

  // current.type === latest.type from here.

  // don't have to process duplicate EXTERNALIZE statement.
  if (current.type === 'EXTERNALIZE') {
    return false;
  }

  const c1 = current.b.counter > latest.b.counter;
  const c1c = current.b.counter === latest.b.counter;
  const c2 = current.p.counter > latest.p.counter;
  const c2c = current.p.counter === latest.p.counter;
  const c3 = current.p_.counter > latest.p_.counter;
  const c3c = current.p_.counter === latest.p_.counter;
  const c4 = current.hCounter > latest.hCounter;

  if (current.type === 'PREPARE') {
    return c1 || (c1c && (c2 || (c2c && (c3 || (c3c && c4)))));
  }
  if (current.type === 'CONFIRM') {
    return c1 || (c1c && (c2 || (c2c && c4)));
  }
}

class BallotState {
  constructor(localNode, slotIndex) {
    this.phase = 'PREPARE';
    this.localNode = localNode;
    this.slotIndex = slotIndex;
    this.b = getNilBallot();
    this.p = getNilBallot();
    this.p_ = getNilBallot();
    this.h = getNilBallot();
    this.c = getNilBallot();
    this.M = {};
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
      b: Object.assign({}, this.b),
      p: Object.assign({}, this.p),
      p_: Object.assign({}, this.p_),
      hCounter: this.h.counter,
      cCounter: this.c.counter,
      quorumSet: this.localNode.cloneQuorumSet(),
    };
    return msg;
  }

  getConfirmMsg() {
    const msg = {
      nodeID: this.localNode.nodeID,
      slotIndex: this.slotIndex,
      type: 'CONFIRM',
      b: Object.assign({}, this.b),
      p: Object.assign({}, this.p),   // only p.counter needed.
      p_: Object.assign({}, this.p_), // not needed.
      hCounter: this.h.counter,
      cCounter: this.c.counter,
      quorumSet: this.localNode.cloneQuorumSet(),
    };

  }

  processMsg(msg) {
    const nodeID = this.localNode.nodeID;
    console.log(`Node${nodeID}: process msg from Node${msg.nodeID}`);
    const from = msg.nodeID;

    if (this.localNode.quorumSet.includes(from) === false) {
      return;
    }

    const latest = this.M[from];
    if (isNew(msg, latest) === false) {
      return;
    }

    if (this.phase === 'EXTERNALIZE' && from !== nodeID) {
      this.localNode.sendMsg(getConfirmMsg(), from);
      return;
    }

    if (msg.type === 'PREPARE') {
      this.processPrepareMsg(msg);
    } else if (msg.type === 'CONFIRM') {
      this.processConfirmMsg(msg);
    }
    this.M[from] = msg;
  }

  processPrepareMsg(msg) {
    if (this.phase !== 'PREPARE') {
        return;
    }

    // Initial case: never voted for anything.
    if (this.b.counter === 0) {  // Nil Ballot
      this.b.value = msg.b.value;
      this.b.counter = 1;
      this.localNode.sendMsg(getPrepareMsg());
      return;
    }

    if (msg.b.value === this.p.value || this.p.counter === 0) {
      const numVotedOrAccepted = getCountVotedOrAcceptedInM(msg);
      if (numVotedOrAccepted >= this.localNode.threshold) {
        this.p = Object.assign({}, this.b);
      }
    } else {
      // contradicted statement. need to check for v-blocking.

    }
  }

  processConfirmMsg(msg) {

  }

  getCountVotedOrAcceptedInM(msg) {
    let count = 0;
    for (const key in this.M) {
      const ballot = this.M[key];
      if (ballot.type === 'CONFIRM') {
        if (ballot.b.counter === msg.b.counter && ballot.b.value === msg.b.value) {
          count++;
        }
      } else if (ballot.type === 'PREPARE') {
        if ((ballot.b.counter === msg.b.counter && ballot.b.value === msg.b.value) ||
            (ballot.p.counter === msg.b.counter && ballot.p.value === msg.b.value)) {
          count++;
        }
      }
    }
    return count;
  }
}

module.exports = BallotState;
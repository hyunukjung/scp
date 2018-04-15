## SCP demonstration
Demonstration of Simplified Stellar Consensus Protocol

## Required installation before running
* node: v8.9.3 (npm: v5.5.1)
  * but any v8.x or higher may work.

## How to Run
* npm start

## Goals
* Understanding the key concept of Stellar Consensus Protocol (SCP)
* Showing a Federated Byzantine Agreement System (FBAS) also works using Quorum Slices

## Scope of this implementation
* modeling nodes and messages sent by them.
* quorum slice
* simple state transitions
  * uncommited -> voted -> accepted -> confirmed

## Todo
* Extending single slot implementation to mulit-slot
* Implementing Ballot Protocol.
* Nominating multiple values (currently nominating a single value only)
* Testing with ill-behaved node model

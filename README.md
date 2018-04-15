## scp
Demonstration of Simplified Stellar Consensus Protocol

## Install
* node: v8.9.3 (npm: v5.5.1), but any v8.x or higher may work.

## How to run
* npm start

## Goals
* Understanding the key concept of Stellar Consensus Protocol (SCP)
* Showing a Federated Byzantine Agreement System (FBAS) also works using Quorum Slices

## Scope of this demonstration
* modeling nodes and message delivery among them.
* quorum slice
* simple state transition
** uncommited -> voted -> accepted -> confirmed

## TODOs
* Extending single slot implementation to mulit-slot
* Implementing Ballot Protocol.
* Nominating multiple values (currently nominating a single value)
* Testing with ill-behaved node model

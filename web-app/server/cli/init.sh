#!/bin/bash

node enrollAdmin.js --orgid=academy
node enrollAdmin.js
node registerUser.js --userid=user1 --orgid=academy
node registerUser.js --userid=user1

# node invoke.js --userid=admin --orgid=academy --func=CreateStudent --studentid=1 --studentname=A

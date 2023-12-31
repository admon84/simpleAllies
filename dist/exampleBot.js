'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var simpleAllies = require('./simpleAllies.js');

function loop() {
    // Read next an ally segment
    simpleAllies.initRun();
    // Other code
    // ...
    // Respond to ally requests
    respondToAllyDefenseRequests();
    respondToAllyResourceRequests();
    // Request support from allies
    requestAllyResources();
    requestAllyDefense();
    // Other code
    // ...
    // Update ally segment
    simpleAllies.endRun();
}
function respondToAllyDefenseRequests() {
    if (!simpleAllies.allySegmentData)
        return;
    // Send creeps to defend rooms
    for (const request of simpleAllies.allySegmentData.requests.defense) {
        console.log('[simpleAllies] Respond to defense request', JSON.stringify(request));
        // Other code
        // ...
    }
}
function respondToAllyResourceRequests() {
    if (!simpleAllies.allySegmentData)
        return;
    // Send resources to rooms
    for (const request of simpleAllies.allySegmentData.requests.resource) {
        console.log('[simpleAllies] Respond to resource request', JSON.stringify(request));
        // Other code
        // ...
    }
}
function requestAllyResources() {
    // Other code
    // ...
    // Add resource request
    simpleAllies.requestResource({
        priority: 1,
        roomName: 'W1N1',
        resourceType: RESOURCE_ENERGY,
        amount: 1000,
    });
}
function requestAllyDefense() {
    // Other code
    // ...
    // Add defense request
    simpleAllies.requestDefense({
        priority: 1,
        roomName: 'W1N1',
    });
}

exports.loop = loop;

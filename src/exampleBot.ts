import * as SimpleAllies from './simpleAllies';

export function loop() {
    // Read next an ally segment
    SimpleAllies.initRun();

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
    SimpleAllies.endRun();
}

function respondToAllyDefenseRequests() {
    if (!SimpleAllies.allySegmentData) return;

    // Send creeps to defend rooms
    for (const request of SimpleAllies.allySegmentData.requests.defense) {
        console.log('[simpleAllies] Respond to defense request', JSON.stringify(request));
        // Other code
        // ...
    }
}

function respondToAllyResourceRequests() {
    if (!SimpleAllies.allySegmentData) return;

    // Send resources to rooms
    for (const request of SimpleAllies.allySegmentData.requests.resource) {
        console.log('[simpleAllies] Respond to resource request', JSON.stringify(request));
        // Other code
        // ...
    }
}

function requestAllyResources() {
    // Other code
    // ...

    // Add resource request
    SimpleAllies.requestResource({
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
    SimpleAllies.requestDefense({
        priority: 1,
        roomName: 'W1N1',
    });
}

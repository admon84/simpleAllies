'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Allies list
const allies = ['Player1', 'Player2', 'Player3'];
// This is the conventional segment used for team communication
const allySegmentID = 90;
// Default object for resetting requests
const defaultRequests = {
    resource: [],
    defense: [],
    attack: [],
    player: [],
    work: [],
    funnel: [],
    room: [],
};
// Current ally requests
exports.myRequests = defaultRequests;
// Current ally username
exports.currentAlly = allies[0];
// Current ally segment data
exports.allySegmentData = void 0;
/**
 * To call before any requests are made or responded to. Configures some required values and gets ally requests
 */
function initRun() {
    // Reset the data of myRequests
    exports.myRequests = defaultRequests;
    exports.allySegmentData = readAllySegment();
}
/**
 * Try to get segment data from our current ally. If successful, assign to the instane
 */
function readAllySegment() {
    if (!allies.length) {
        console.log('[simpleAllies] You have no allies');
        return;
    }
    exports.currentAlly = allies[Game.time % allies.length];
    // Make a request to read the data of the next ally in the list, for next tick
    const nextAllyName = allies[(Game.time + 1) % allies.length];
    RawMemory.setActiveForeignSegment(nextAllyName, allySegmentID);
    // Maybe the code didn't run last tick, so we didn't set a new read segment
    if (!RawMemory.foreignSegment)
        return;
    if (RawMemory.foreignSegment.username !== exports.currentAlly)
        return;
    return parseSegment(RawMemory.foreignSegment.data);
}
function parseSegment(data) {
    try {
        return JSON.parse(data);
    }
    catch (e) {
        console.log(`[simpleAllies] Error reading ${exports.currentAlly} segment ${allySegmentID}`);
    }
}
/**
 * To call after requests have been made, to assign requests to the next ally
 */
function endRun() {
    // Make sure we don't have too many segments open
    if (Object.keys(RawMemory.segments).length >= 10) {
        console.log('[simpleAllies] Too many segments open');
        return;
    }
    RawMemory.segments[allySegmentID] = JSON.stringify({
        requests: exports.myRequests,
    });
    RawMemory.setPublicSegments([allySegmentID]);
}
/**
 * Request resource
 * @param args - a request object
 * @param {number} args.priority - 0-1 where 1 is highest consideration
 * @param {string} args.roomName
 * @param {'energy' | ResourceConstant} args.resourceType
 * @param {number} args.amount - How much they want of the resource. If the responder sends only a portion of what you ask for, that's fine
 * @param {boolean} [args.terminal] - If the bot has no terminal, allies should instead haul the resources to us
 */
function requestResource(args) {
    exports.myRequests.resource.push(args);
}
/**
 * Request help in defending a room
 * @param args - a request object
 * @param {number} args.priority - 0-1 where 1 is highest consideration
 * @param {string} args.roomName
 */
function requestDefense(args) {
    exports.myRequests.defense.push(args);
}
/**
 * Request an attack on a specific room
 * @param args - a request object
 * @param {number} args.priority - 0-1 where 1 is highest consideration
 * @param {string} args.roomName
 */
function requestAttack(args) {
    exports.myRequests.attack.push(args);
}
/**
 * Influence allies aggresion score towards a player
 * @param args - a request object
 * @param {string} args.playerName - name of the hostile player
 * @param {number} [args.hate] - 0-1 where 1 is highest consideration. How much you think your team should hate the player. Should probably affect combat aggression and targetting
 * @param {number} [args.lastAttackedBy] - The last time this player has attacked you
 */
function requestPlayer(args) {
    exports.myRequests.player.push(args);
}
/**
 * Request help in building/fortifying a room
 * @param args - a request object
 * @param {string} args.roomName
 * @param {number} args.priority - 0-1 where 1 is highest consideration
 * @param {EWorkRequestType.BUILD | EWorkRequestType.REPAIR} args.workType
 */
function requestWork(args) {
    exports.myRequests.work.push(args);
}
/**
 * Request energy to a room for a purpose of making upgrading faster.
 * @param args - a request object
 * @param {number} args.maxAmount - Amount of energy needed. Should be equal to energy that needs to be put into controller for achieving goal.
 * @param {EFunnelGoalType.GCL | EFunnelGoalType.RCL7 | EFunnelGoalType.RCL8} args.goalType - What energy will be spent on. Room receiving energy should focus solely on achieving the goal.
 * @param {string} [args.roomName] - Room to which energy should be sent. If undefined resources can be sent to any of requesting player's rooms.
 */
function requestFunnel(args) {
    exports.myRequests.funnel.push(args);
}
/**
 * Share how your bot is doing economically
 * @param args - a request object
 * @param {number} args.credits - total credits the bot has. Should be 0 if there is no market on the server
 * @param {number} args.sharableEnergy - the maximum amount of energy the bot is willing to share with allies. Should never be more than the amount of energy the bot has in storing structures
 * @param {number} [args.energyIncome] - The average energy income the bot has calculated over the last 100 ticks. Optional, as some bots might not be able to calculate this easily.
 * @param {Object.<MineralConstant, number>} [args.mineralNodes] - The number of mineral nodes the bot has access to, probably used to inform expansion
 */
function requestEcon(args) {
    exports.myRequests.econ = args;
}
/**
 * Share scouting data about hostile owned rooms
 * @param args - a request object
 * @param {string} args.roomName
 * @param {string} args.playerName - The player who owns this room. If there is no owner, the room probably isn't worth making a request about
 * @param {number} args.lastScout - The last tick your scouted this room to acquire the data you are now sharing
 * @param {number} args.rcl
 * @param {number} args.energy - The amount of stored energy the room has. storage + terminal + factory should be sufficient
 * @param {number} args.towers
 * @param {number} args.avgRamprtHits
 * @param {boolean} args.terminal - does scouted room have terminal built
 */
function requestRoom(args) {
    exports.myRequests.room.push(args);
}

exports.allies = allies;
exports.allySegmentID = allySegmentID;
exports.endRun = endRun;
exports.initRun = initRun;
exports.parseSegment = parseSegment;
exports.requestAttack = requestAttack;
exports.requestDefense = requestDefense;
exports.requestEcon = requestEcon;
exports.requestFunnel = requestFunnel;
exports.requestPlayer = requestPlayer;
exports.requestResource = requestResource;
exports.requestRoom = requestRoom;
exports.requestWork = requestWork;

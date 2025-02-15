'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Allies list
 */
const allies = ['Player1', 'Player2', 'Player3'];
/**
 * This segment ID used for team communication
 */
const allySegmentID = 90;
/**
 * Represents the goal type enum for javascript
 */
const EFunnelGoal = {
    GCL: 0,
    RCL7: 1,
    RCL8: 2,
};
/**
 * Represents the goal type enum for javascript
 */
const EWorkType = {
    BUILD: 'build',
    REPAIR: 'repair',
};
/**
 * Simple allies class manages ally requests
 */
class SimpleAllies {
    constructor() {
        /**
         * State
         */
        this.myRequests = {
            resource: [],
            defense: [],
            attack: [],
            player: [],
            work: [],
            funnel: [],
            room: [],
        };
    }
    /**
     * To call before any requests are made or responded to.
     */
    initRun() {
        // Reset requests
        this.myRequests = {
            resource: [],
            defense: [],
            attack: [],
            player: [],
            work: [],
            funnel: [],
            room: [],
        };
        // Reset econ info
        this.myEconInfo = undefined;
        // Read ally segment data
        this.allySegmentData = this.readAllySegment();
    }
    /**
     * Try to read the ally segment data
     */
    readAllySegment() {
        if (!allies.length) {
            console.log('[simpleAllies] You have no allies');
            return;
        }
        this.currentAlly = allies[Game.time % allies.length];
        // Make a request to read the data of the next ally in the list, for next tick
        const nextAllyName = allies[(Game.time + 1) % allies.length];
        RawMemory.setActiveForeignSegment(nextAllyName, allySegmentID);
        // Maybe the code didn't run last tick, so we didn't set a new read segment
        if (!RawMemory.foreignSegment)
            return;
        if (RawMemory.foreignSegment.username !== this.currentAlly)
            return;
        // Try to parse the segment data
        try {
            return JSON.parse(RawMemory.foreignSegment.data);
        }
        catch (e) {
            console.log(`[simpleAllies] Error reading ${this.currentAlly} segment ${allySegmentID}`);
        }
    }
    /**
     * To call after requests have been made, to assign requests to the next ally
     */
    endRun() {
        if (Object.keys(RawMemory.segments).length >= 10) {
            console.log('[simpleAllies] Too many segments open');
            return;
        }
        RawMemory.segments[allySegmentID] = JSON.stringify({
            requests: this.myRequests,
            econ: this.myEconInfo,
            updated: Game.time,
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
     * @param {number} [args.timeout] - Tick after which the request should be ignored. If your bot crashes, or stops updating requests for some other reason, this is a safety mechanism.
     */
    requestResource(args) {
        this.myRequests.resource.push(args);
    }
    /**
     * Request help in defending a room
     * @param args - a request object
     * @param {number} args.priority - 0-1 where 1 is highest consideration
     * @param {string} args.roomName
     * @param {number} [args.timeout] - Tick after which the request should be ignored. If your bot crashes, or stops updating requests for some other reason, this is a safety mechanism.
     */
    requestDefense(args) {
        this.myRequests.defense.push(args);
    }
    /**
     * Request an attack on a specific room
     * @param args - a request object
     * @param {number} args.priority - 0-1 where 1 is highest consideration
     * @param {string} args.roomName
     * @param {number} [args.timeout] - Tick after which the request should be ignored. If your bot crashes, or stops updating requests for some other reason, this is a safety mechanism.
     */
    requestAttack(args) {
        this.myRequests.attack.push(args);
    }
    /**
     * Influence allies aggresion score towards a player
     * @param args - a request object
     * @param {string} args.playerName - name of the hostile player
     * @param {number} [args.hate] - 0-1 where 1 is highest consideration. How much you think your team should hate the player. Should probably affect combat aggression and targetting
     * @param {number} [args.lastAttackedBy] - The last time this player has attacked you
     * @param {number} [args.timeout] - Tick after which the request should be ignored. If your bot crashes, or stops updating requests for some other reason, this is a safety mechanism.
     */
    requestPlayer(args) {
        this.myRequests.player.push(args);
    }
    /**
     * Request help in building/fortifying a room
     * @param args - a request object
     * @param {string} args.roomName
     * @param {number} args.priority - 0-1 where 1 is highest consideration
     * @param {EWorkType.BUILD | EWorkType.REPAIR} args.workType
     * @param {number} [args.timeout] - Tick after which the request should be ignored. If your bot crashes, or stops updating requests for some other reason, this is a safety mechanism.
     */
    requestWork(args) {
        this.myRequests.work.push(args);
    }
    /**
     * Request energy to a room for a purpose of making upgrading faster.
     * @param args - a request object
     * @param {number} args.maxAmount - Amount of energy needed. Should be equal to energy that needs to be put into controller for achieving goal.
     * @param {EFunnelGoal.GCL | EFunnelGoal.RCL7 | EFunnelGoal.RCL8} args.goalType - What energy will be spent on. Room receiving energy should focus solely on achieving the goal.
     * @param {string} [args.roomName] - Room to which energy should be sent. If undefined resources can be sent to any of requesting player's rooms.
     * @param {number} [args.timeout] - Tick after which the request should be ignored. If your bot crashes, or stops updating requests for some other reason, this is a safety mechanism.
     */
    requestFunnel(args) {
        this.myRequests.funnel.push(args);
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
     * @param {number} [args.timeout] - Tick after which the request should be ignored. If your bot crashes, or stops updating requests for some other reason, this is a safety mechanism.
     */
    requestRoom(args) {
        this.myRequests.room.push(args);
    }
    /**
     * Share how your bot is doing economically
     * @param args - a request object
     * @param {number} args.credits - total credits the bot has. Should be 0 if there is no market on the server
     * @param {number} args.sharableEnergy - the maximum amount of energy the bot is willing to share with allies. Should never be more than the amount of energy the bot has in storing structures
     * @param {number} [args.energyIncome] - The average energy income the bot has calculated over the last 100 ticks. Optional, as some bots might not be able to calculate this easily.
     * @param {Object.<MineralConstant, number>} [args.mineralNodes] - The number of mineral nodes the bot has access to, probably used to inform expansion
     */
    setEconInfo(args) {
        this.myEconInfo = args;
    }
}
const simpleAllies = new SimpleAllies();

exports.EFunnelGoal = EFunnelGoal;
exports.EWorkType = EWorkType;
exports.allies = allies;
exports.allySegmentID = allySegmentID;
exports.simpleAllies = simpleAllies;

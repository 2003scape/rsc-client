const Long = require('long');

class GameCharacter {
    constructor() {
        this.hash = new Long();
        this.name = null;
        this.serverIndex = 0;
        this.serverId = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.npcId = 0;
        this.stepCount = 0;
        this.animationCurrent = 0;
        this.animationNext = 0;
        this.movingStep = 0;
        this.waypointCurrent = 0;
        this.message = null;
        this.messageTimeout = 0;
        this.bubbleItem = 0;
        this.bubbleTimeout = 0;
        this.damageTaken = 0;
        this.healthCurrent = 0;
        this.healthMax = 0;
        this.combatTimer = 0;
        this.level = 0;
        this.colourHair = 0;
        this.colourTop = 0;
        this.colourBottom = 0;
        this.colourSkin = 0;
        this.incomingProjectileSprite = 0;
        this.attackingPlayerServerIndex = 0;
        this.attackingNpcServerIndex = 0;
        this.projectileRange = 0;
        this.skullVisible = 0;
        this.waypointsX = new Int32Array(10);
        this.waypointsY = new Int32Array(10);
        this.equippedItem = new Int32Array(12);
        this.level = -1;
    }
}

module.exports = GameCharacter;


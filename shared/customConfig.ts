// dev testing
export const devMode = false;
export const ignoreDmg = false;
export const botIgnoreObstacles = false;

export const newStrafe = true;

export const airplaneTime = 3; // usually 15, time for airplane to drop airdrop

const factionBotsN = 50;
export const factionBots = devMode ? 1 : factionBotsN;

export const adrenMode = false;
export const adrenTotal = 400;
export const MAX_BOOST = adrenMode ? adrenTotal : 100;
export const adrenSpeedBoost = 0.02;
export const adrenHealBoost = 0.015;

// bot hiding & anti-camping tester
export const ignoreSmoke = true;
export const ignoreBushcamp = true;

export const closeEarly = true; // close if only bots left
export const addBotsDelay = 0.1; // 1 sec to add 25 bots -- maybe that (0.04) is too fast
// export const addBotsDelay = 0.5;
export const maxBotsAtTime = 45; // max is 80 in solo game, was 80 earlier, but 25 in new-client

export const shootLead = 0.2;
export const scaleLead = 1.2; // how much extra after dividing by 4xscope distance
export const strafeStrength = 0.5; // this barely does anything
// change ~5 times a second optimal?
export const strafeProbChange = 0.1;
export const spreadStrength = 0.0002;
export const spreadDistStrength = 0.5;
export const targetMaxRange = 10000;
export const targetMinRange = 100;
export const botPetMaxRange = 100;

export const petMaxMoveRange = 1000;

export const mosinBotShootLead = true; // in ur case its true
export const mosinBotRNG = 0.05; // in ur case its 0

export const startTime = 300; // base 60 -- 1 min

export const diffObstacleHP = false;

export const safeConstants = {
    OK_TIMER: 0.1, // bing chillin
    BAD_TIMER: 2.5,
}
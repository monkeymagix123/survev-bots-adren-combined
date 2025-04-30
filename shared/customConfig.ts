export const devMode = false;

export const ignoreDmg = false;

export const airplaneTime = 3; // usually 15, time for airplane to drop airdrop

const factionBotsN = 50;
export const factionBots = devMode ? 1 : factionBotsN;

export const adrenMode = true;
export const adrenTotal = 400;  
export const adrenSpeedBoost = 0.02;
export const adrenHealBoost = 0.015;

export const closeEarly = true; // close if only bots left
export const addBotsDelay = 0.4; // 1 sec to add 25 bots -- maybe that (0.04) is too fast
export const maxBotsAtTime = 45; // max is 80 in solo game, was 80 earlier, but 25 in new-client

export const botIgnoreObstacles = false;
export const shootLead = 0.2;
export const strafeStrength = 0.5; // this barely does anything
export const strafeProbChange = 0.1;
export const spreadStrength = 0.0002;
export const spreadDistStrength = 0.5;
export const targetMaxRange = 100000000; // you were squaring this as well

export const petMaxMoveRange = 1000;

export const mosinBotShootLead = true; 
export const mosinBotRNG = 0.05; 

export const startTime = 300; 

export const diffObstacleHP = false;

export const safeConstants = {
    OK_TIMER: 0.1, // bing chillin
    BAD_TIMER: 2.5,
}
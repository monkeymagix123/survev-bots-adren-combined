export const devMode = false;

export const ignoreDmg = false;

const factionBotsN = 50;
export const factionBots = devMode ? 1 : factionBotsN;

export const adrenMode = true;
export const adrenTotal = 400;  
export const adrenSpeedBoost = 0.02;
export const adrenHealBoost = 0.015;

export const botIgnoreObstacles = false;
export const shootLead = 0.2;
export const strafeStrength = 0.5; // this barely does anything
export const strafeProbChange = 0.1;
export const spreadStrength = 0.0001;
export const spreadDistStrength = 0.5;
export const targetMaxRange = 10000;
export const targetMinRange = 100;

export const mosinBotShootLead = true; // in ur case its true
export const mosinBotRNG = 0.05; // in ur case its 0

export const startTime = 300; // base 60 -- 1 min

export const diffObstacleHP = false;

export const safeConstants = {
    OK_TIMER: 0.1, // bing chillin
    BAD_TIMER: 2.5,
}
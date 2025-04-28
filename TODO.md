

Each emoji has a meaning:
- ✅: This bug/exploit is fixed.
- ⚠️: This bug/exploit is half-fixed; Has problems and/or not accurate like the original one.
- ❌: This bug/exploit is still not fixed.

# Bugs/exploits:
## Bots
**1. Movement**
- ❌: Hide behind stuff
  - ❌: Heal / reload
- ❌: Dodge grenades
- ❌: Avoid barrels
- ⚠️: Better movement around obstacles
- ❌: Make strafe change direction chance exponential / increase with time

**2. Aiming**
- ❌: Bots melee at close range
- ❌: Better finishing off knocked out players
- ❌: Shoot barrels

- ❌: Throw grenades?

**3. Other**
- ❌: Looting / shooting potatoes


Separate bot code


## Maps
**1. General:**
- ❌: Not infinite adren & buffed adren speed in solo
  - ❌: A problem is gear defs (maybe change logic in player.ts?)



## GPT
- Refine moveFight: Re-evaluate the logic to ensure it correctly balances approaching and maintaining distance from the target.
- Improve Obstacle Targeting: Implement more strategic selection of destructible obstacles to target.
- Context-Aware Healing/Boosting: Make the healing and boosting decisions more responsive to the current combat situation.
- Consider Threat Assessment for Targeting: Weigh potential targets based on factors like distance, current activity (shooting), and weapon type.
- Add More Sophisticated Movement Patterns: Implement more complex movement behaviors like flanking or using cover.
- Parameterize Bot Behavior: Consider using configuration or data to control various bot parameters (e.g., aiming accuracy, aggression level, preferred engagement distance) to create more diverse bot personalities.
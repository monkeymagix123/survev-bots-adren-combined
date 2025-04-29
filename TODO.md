

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
- ❌: Building movement (ie moving while indoors)
- ❌: go to main areas (depends on map -- normal --> like just wander around, or go to club / mansion / etc, 50v50 --> go to bridges)
- ❌: pathfinding

**2. Aiming**
- ❌: Bots melee at close range
- ❌: Better finishing off knocked out players
- ❌: Shoot barrels

- ❌: Throw grenades?

- ❌: Not trying to shoot through walls

**3. Other**
- ❌: Looting / shooting potatoes
- ❌: actually playing their roles in 50v50



Separate bot code


## Maps
**1. General:**
- ❌: Not infinite adren & buffed adren speed in solo
  - ❌: A problem is gear defs (maybe change logic in player.ts?)


## New content
**List of random ideas**
1) ⚠️: spud gun, except it shoots snowballs instead (slow & drop random item) -- DONE
  - working on balancing?
2) ❌: perk that makes u faster (like 15% or smth)
3) ❌: perk that makes gun bullets a lot more invisible (harder to see, like m4a1-s)
4) ❌: perk that makes gun bullets invisible
5) ❌: infection mode -- beating player adds them to your team
6) ❌: alternate universe mode -- 50% faster but more dmg (25%) 
7) ❌: perk that heals shots
8) ⚠️: loot house
  - figure out what modes to add to
9) ❌: temp fix - give bots flak jacket but worsen their aim
10) ❌: everyone plays in one large maze (similar to that of diep)
11) ❌: instant use adren items (perk? class? mode?)
12) ❌: guns/perk that pierce stuff (ie go through obstacles)
13) ❌: Slow effects (perk / weapon), maybe 3 sec?
14) ❌: Maze building
15) ❌: Loadout UI??? (starting weapons)
16) ❌: gamerio mode or something (100% sv at docks, buff scope drop rates, etc)
17) ❌: perk that buffs reload speed / fire delay?


## GPT
- Refine moveFight: Re-evaluate the logic to ensure it correctly balances approaching and maintaining distance from the target.
- Improve Obstacle Targeting: Implement more strategic selection of destructible obstacles to target.
- Context-Aware Healing/Boosting: Make the healing and boosting decisions more responsive to the current combat situation.
- Consider Threat Assessment for Targeting: Weigh potential targets based on factors like distance, current activity (shooting), and weapon type.
- Add More Sophisticated Movement Patterns: Implement more complex movement behaviors like flanking or using cover.
- Parameterize Bot Behavior: Consider using configuration or data to control various bot parameters (e.g., aiming accuracy, aggression level, preferred engagement distance) to create more diverse bot personalities.
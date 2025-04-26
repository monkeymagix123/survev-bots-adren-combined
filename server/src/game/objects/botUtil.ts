import {
    GameObjectDefs,
    type LootDef,
    WeaponTypeToDefs,
} from "../../../../shared/defs/gameObjectDefs";
import { type EmoteDef, EmotesDefs } from "../../../../shared/defs/gameObjects/emoteDefs";
import {
    type BackpackDef,
    type BoostDef,
    type ChestDef,
    GEAR_TYPES,
    type HealDef,
    type HelmetDef,
    SCOPE_LEVELS,
    type ScopeDef,
} from "../../../../shared/defs/gameObjects/gearDefs";
import { GunDefs, type GunDef } from "../../../../shared/defs/gameObjects/gunDefs";
import { type MeleeDef, MeleeDefs } from "../../../../shared/defs/gameObjects/meleeDefs";
import type { OutfitDef } from "../../../../shared/defs/gameObjects/outfitDefs";
import { PerkProperties } from "../../../../shared/defs/gameObjects/perkDefs";
import type { RoleDef } from "../../../../shared/defs/gameObjects/roleDefs";
import type { ThrowableDef } from "../../../../shared/defs/gameObjects/throwableDefs";
import { UnlockDefs } from "../../../../shared/defs/gameObjects/unlockDefs";
import {
    type Action,
    type Anim,
    GameConfig,
    type HasteType,
} from "../../../../shared/gameConfig";
import * as net from "../../../../shared/net/net";
import { ObjectType } from "../../../../shared/net/objectSerializeFns";
import type { GroupStatus } from "../../../../shared/net/updateMsg";
import { type Circle, coldet } from "../../../../shared/utils/coldet";
import { collider } from "../../../../shared/utils/collider";
import { math } from "../../../../shared/utils/math";
import { assert, util } from "../../../../shared/utils/util";
import { type Vec2, v2 } from "../../../../shared/utils/v2";
import { Config } from "../../config";
import { IDAllocator } from "../../utils/IDAllocator";
import { validateUserName } from "../../utils/serverHelpers";
import type { Game, JoinTokenData } from "../game";
import { Group } from "../group";
import { Team } from "../team";
import { WeaponManager, throwableList } from "../weaponManager";
import { BaseGameObject, type DamageParams, type GameObject } from "./gameObject";
import type { Loot } from "./loot";
import type { MapIndicator } from "./mapIndicator";
import type { Obstacle } from "./obstacle";

import { Player, Bot, DumBot} from "./player";

import { MapObjectDefs } from "../../../../shared/defs/mapObjectDefs";
import { ObstacleDef } from "../../../../shared/defs/mapObjectsTyping";
import { targetMaxRange } from "../../../../shared/customConfig";
import { BulletDefs } from "../../../../shared/defs/gameObjects/bulletDefs";

export const BotUtil = {
    // basic utilities
    dist2(a: Vec2, b: Vec2) {
        return ((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    },

    same(one: Team | Group | undefined, two: Team | Group | undefined): boolean {
        if (one === undefined) {
            return false;
        }
        return (one === two);
    },

    sameTeam(a: Player | undefined, b: Player | undefined): boolean {
        if (this.same(a?.team, b?.team))
            return true;
        if (this.same(a?.group, b?.group))
            return true;

        return false;
    },

    randomSym(n: number): number {
        let r = Math.random();

        return (2 * r - 1) * n;
    },

    // actual advanced functions / utilities
    noNearbyBullet(bot: Player): boolean {
        const nearbyBullet = bot.game.bulletBarn.bullets
            .filter(
                (obj) =>
                    obj.active && obj.alive && obj.player != bot && (obj.player === undefined || !this.sameTeam(bot, obj.player)),
            );

        nearbyBullet.forEach((b) => {
            // change logic -- where it will go to? but not too far away
            let dir = b.dir;
            let pos = b.pos;

            let dist = this.dist2(bot.pos, pos); // distance bullet position to player
            let perp = v2.perp(b.dir);
            let perpDist = v2.lengthSqr(v2.proj(v2.sub(bot.pos, pos), perp));

            let targetD = (GameConfig.player.reviveRange * 1.5) ** 2;

            if (dist <= targetD * 200 && perpDist <= targetD) {
                // stop moving in straight line
                // testing below
                // this.game.playerBarn.addEmote(
                //     this.__id,
                //     this.pos,
                //     "emote_dabface",
                //     false,
                // );
                return false;
            }
        });

        return true;
    },

    /**
     * Gets the closest player
     * @param isInRange if it has to be in visible range, defaults to false
     * @param needPlayer if it has to be an actual player (not a bot), defaults to false
     * @param needEnemy if it cannot be a teammate, defaults to true
     * @returns the closest player
     */
    getClosestPlayer(bot: Player, isInRange = false, needPlayer = false, needEnemy = true): Player | undefined {
        const nearbyEnemy = this.getAllPlayers(bot, isInRange, needPlayer);

        let closestPlayer: Player | undefined = undefined;
        let closestDist = Number.MAX_VALUE;
        for (const p of nearbyEnemy) {
            if (!util.sameLayer(bot.layer, p.layer)) {
                continue;
            }

            if (needEnemy && BotUtil.sameTeam(bot, p)) {
                continue;
            }

            const dist = BotUtil.dist2(bot.pos, p.pos);
            if (dist > targetMaxRange * targetMaxRange) {
                continue;
            }
            if (dist < closestDist && p != bot) {
                closestPlayer = p;
                closestDist = dist;
            }
        }

        return closestPlayer;
    },

    /**
     * Gets all players satisfying conditions
     * @param isInRange if it has to be in visible range, defaults to false
     * @param needPlayer if it has to be an actual player (not a bot), defaults to false
     * @returns all such players
     */
    getAllPlayers(bot: Player, isInRange = false, needPlayer = false): Player[] {
        // diff zone?
        const radius = bot.zoom + 4;
        let rect = coldet.circleToAabb(bot.pos, radius * 0.7); // a bit less
        // vertical scaling: 2 since usually windows have aspect ratio 2:1
        let scaled = coldet.scaleAabbAlongAxis(rect, v2.create(0, 1), 1 / 2.2);
        rect.min = scaled.min;
        rect.max = scaled.max;

        const coll = isInRange ? rect : collider.createCircle(bot.pos, 10000);

        const nearbyEnemy = bot.game.grid
            .intersectCollider(
                coll,
            )
            .filter(
                (obj): obj is Player =>
                    obj.__type == ObjectType.Player && !obj.dead && !(needPlayer && obj instanceof Bot),
            );

        return nearbyEnemy;
    },

    isVisible(bot: Player, player: Player | undefined): boolean {
        if (player === undefined) {
            return false;
        }
        return (this.getAllPlayers(bot, true).includes(player));
    },

    getCollidingObstacles(bot: Player, needDestructible = false): Obstacle[] {
        const coll1 = collider.createCircle(bot.posOld, bot.rad * 2);
        // const coll = bot.collider;
        
        let o = bot.game.grid.intersectCollider(coll1).filter((obj) => 
            obj.__type === ObjectType.Obstacle,
        );

        o = o.filter((obj) => !obj.dead && !obj.destroyed && obj.collidable,);

        const coll = collider.createCircle(bot.posOld, bot.rad * 1.1);

        let o2 : Obstacle[] = [];

        for (let i = 0; i < o.length; i++) {
            let obj = o[i];
            if (collider.intersect(coll, obj.collider)) {
                o2.push(obj);
            }
        }

        if (needDestructible) {
            o2 = o2.filter((obj) => obj.destructible && !(MapObjectDefs[obj.type] as ObstacleDef).armorPlated && !(MapObjectDefs[obj.type] as ObstacleDef).stonePlated && !(MapObjectDefs[obj.type] as ObstacleDef).explosion);
        }

        return o2;
    },

    // at some point also want to cache this?
    getPrefDist(g: string): minMax {
        // cache ??
        if (gunDist[g]) {
            return gunDist[g];
        }

        // min: min distance at which chillin
        // max: max distance at which chillin
        // < min --> move farther, > min --> move closer

        if (!GunDefs[g]) {
            // prob melee / grenade
            // assume melee
            return new minMax(0, 0);
        }

        const zm = GameConfig.scopeZoomRadius["desktop"];

        let z1 = zm["1xscope"];
        let z2 = zm["2xscope"];
        let z4 = zm["4xscope"];
        let z8 = zm["8xscope"];

        let d = GunDefs[g];

        // potato cannon, m79, etc (flare here cuz im lazy)
        if (d.isLauncher || d.name.includes("flare")) {
            // prob a bit larger than 4x scope to 2x scope
            return new minMax(z2, z4 * 1.2);
        }

        // most guns that don't split
        if (d.ammo != "12gauge") {
            // usually no splitting
            // function based on spread???
            let b = BulletDefs[d.bulletType];

            if (b.speed < 100) {
                // prob smg / assault rifle
                // mac10: 21 spread, mp5: 7, vector: 7 (move spread), shot spread: 10, 3, 2.5
                let maxD = b.distance * 0.9; // Math.min(b.distance * 0.9, z1 * 5 / d.shotSpread)
                return new minMax(z1 * 0.25, maxD);
            } else {
                // prob dmr / sniper
                return new minMax(z2 * 1.2, z8 * 1.25);
            }
        }
        
        // smg / assault rifle: prob around 2x-4x scope

        // maybe based on bullet speed? benchmark: prob 200 ~ great on 8x
        // mosin: 178, sv: 182
        // mac 10: 75, mp5: 85, vector: 88
        // pkp: 120
        // also include accuracy?


        // spas
        if (d.name === "spas12") {
            return new minMax(z1, z4 * 1.2);
        }

        // super 90
        if (d.name === "m1014") {
            return new minMax(z2 * 0.9, (z4 + z8)/2);
        }

        // should be just shotguns left
        return new minMax(5, z2);

        // // safeguard, should not happen
        // return new minMax(0, 0);
    }
}

let gunDist: Record<string, minMax> = {};

export class minMax {
    min: number;
    max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}
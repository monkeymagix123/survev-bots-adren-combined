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
import type { GunDef } from "../../../../shared/defs/gameObjects/gunDefs";
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

export class BotUtil {
    // basic utilities
    static dist2(a: Vec2, b: Vec2) {
        return ((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }

    static same(one: Team | Group | undefined, two: Team | Group | undefined): boolean {
        if (one === undefined) {
            return false;
        }
        return (one === two);
    }

    static sameTeam(a: Player | undefined, b: Player | undefined): boolean {
        if (this.same(a?.team, b?.team))
            return true;
        if (this.same(a?.group, b?.group))
            return true;

        return false;
    }

    static randomSym(n: number): number {
        let r = Math.random();

        return (2 * r - 1) * n;
    }

    // actual advanced functions / utilities
    static noNearbyBullet(bot: Player): boolean {
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
    }

    /**
     * Gets the closest player
     * @param isInRange if it has to be in visible range, defaults to false
     * @param needPlayer if it has to be an actual player (not a bot), defaults to false
     * @param needEnemy if it cannot be a teammate, defaults to true
     * @returns the closest player
     */
    static getClosestPlayer(bot: Player, isInRange = false, needPlayer = false, needEnemy = true): Player | undefined {
        const nearbyEnemy = this.getAllPlayers(bot, isInRange, needPlayer);

        let closestPlayer: Player | undefined;
        let closestDist = Number.MAX_VALUE;
        for (const p of nearbyEnemy) {
            if (!util.sameLayer(bot.layer, p.layer)) {
                continue;
            }
            // buildings??
            // if (p.indoors != this.indoors) {
            //     continue;
            // }
            // teammates
            if (needEnemy && BotUtil.sameTeam(bot, p)) {
                continue;
            }

            // const dist = v2.distance(this.pos, p.pos);
            const dist = BotUtil.dist2(bot.pos, p.pos);
            // if (dist <= GameConfig.player.reviveRange && dist < closestDist) {
            if (dist < closestDist && p != bot) {
                closestPlayer = p;
                closestDist = dist;
            }
        }

        return closestPlayer;
    }

    /**
     * Gets all players satisfying conditions
     * @param isInRange if it has to be in visible range, defaults to false
     * @param needPlayer if it has to be an actual player (not a bot), defaults to false
     * @returns all such players
     */
    static getAllPlayers(bot: Player, isInRange = false, needPlayer = false): Player[] {
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
    }

    static isVisible(bot: Player, player: Player | undefined): boolean {
        if (player === undefined) {
            return false;
        }
        return (this.getAllPlayers(bot, true).includes(player));
    }

    static getCollidingObstacles(bot: Player, needDestructible = false): Obstacle[] {
        const coll1 = collider.createCircle(bot.posOld, bot.rad * 2);
        // const coll = bot.collider;
        
        let o = bot.game.grid.intersectCollider(coll1).filter((obj) => 
            obj.__type === ObjectType.Obstacle,
        );

        o.filter((obj) => !obj.dead && !obj.destroyed && obj.collidable,);

        const coll = collider.createCircle(bot.posOld, bot.rad * 1.1);

        let o2 : Obstacle[] = [];

        for (let i = 0; i < o.length; i++) {
            let obj = o[i];
            if (collider.intersect(coll, obj.collider)) {
                o2.push(obj);
            }
        }

        if (needDestructible) {
            o2 = o2.filter((obj) => obj.destructible && !(MapObjectDefs[obj.type] as ObstacleDef).armorPlated && !(MapObjectDefs[obj.type] as ObstacleDef).stonePlated,);
        }

        return o2;
    }
}
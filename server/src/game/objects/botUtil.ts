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

import { Player, Bot, TeamBot} from "./player";

import { MapObjectDefs } from "../../../../shared/defs/mapObjectDefs";
import { ObstacleDef } from "../../../../shared/defs/mapObjectsTyping";
import { targetMaxRange } from "../../../../shared/customConfig";
import { BulletDefs } from "../../../../shared/defs/gameObjects/bulletDefs";
import { Bullet } from "./bullet";

export const BotUtil = {
    // general utils

    d2(v1: Vec2, v2: Vec2): number {
        return (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y);
    },

    same(one: Team | Group | undefined, two: Team | Group | undefined): boolean {
        return one !== undefined && one === two;
    },

    sameTeam(a: Player | undefined, b: Player | undefined): boolean {
        // check if defined
        if (!a || !b) {
            return false;
        }
        return this.same(a.team, b.team) || this.same(a.group, b.group);
    },

    randomSym(n: number): number {
        return (Math.random() * 2 - 1) * n;
    },

    // player utils
    // Checks if player **p** is hidden from player **b**
    hidden(p: Player, b: Player): boolean {
        let g = b.game;

        // smoke grenade testing
        let s = g.smokeBarn.smokes.filter((obj) =>
            !obj.destroyed && util.sameLayer(p.layer, obj.layer)
        ).some((obj) =>
            coldet.testCircleCircle(p.pos, p.rad, obj.pos, obj.rad)
        );

        if (s) {
            return true;
        }

        return false;
    },


    // utils for bot logic

    noNearbyBullet(bot: Player) {
        const targetD = (GameConfig.player.reviveRange * 1.5) ** 2;
        return !bot.game.bulletBarn.bullets.some(b => 
            b.active && b.alive && b.player !== bot && (!b.player || !this.sameTeam(bot, b.player)) &&
            this.d2(bot.pos, b.pos) <= targetD * 200 &&
            v2.lengthSqr(v2.proj(v2.sub(bot.pos, b.pos), v2.perp(b.dir))) <= targetD
        );
    },

    getPlayers(bot: Player, visible = false, needPlayer = false) {
        if (!visible) {
            return bot.game.playerBarn.livingPlayers.filter(
                (player) => !(needPlayer && player instanceof Bot)
            );
        }
        let scaled = coldet.scaleAabbAlongAxis(coldet.circleToAabb(bot.pos, (bot.zoom + 4) * 0.7), v2.create(0, 1), 1 / 2.2);
        return bot.game.playerBarn.livingPlayers.filter(
            (player) =>
                scaled.min.x <= player.pos.x && player.pos.x <= scaled.max.x && 
                scaled.min.y <= player.pos.y && player.pos.y <= scaled.max.y &&
                !(needPlayer && player instanceof Bot)
        );
        /* 
        const radius = bot.zoom + 4;
        let rect = coldet.circleToAabb(bot.pos, radius * 0.7); // a bit less
        // vertical scaling: 2 since usually windows have aspect ratio 2:1
        let scaled = coldet.scaleAabbAlongAxis(rect, v2.create(0, 1), 1 / 2.2);
        rect.min = scaled.min;
        rect.max = scaled.max;

        const coll = visible
            ? rect
            : collider.createCircle(bot.pos, 10000);

        
        return bot.game.grid.intersectCollider(coll).filter(
            (obj): obj is Player => obj.__type === ObjectType.Player && !obj.dead && !(needPlayer && obj instanceof Bot)
        );
        */
    },

    getClosestOpponent(bot: Player, visible = false, needPlayer = false, maxRange = targetMaxRange) {
        let closest: Player | undefined = undefined;
        let minDist = Number.MAX_VALUE;
        for (const p of this.getPlayers(bot, visible, needPlayer)) {
            if (
                !util.sameLayer(bot.layer, p.layer) ||
                this.sameTeam(bot, p) ||
                p === bot) {
                continue;
            }

            const d = this.d2(bot.pos, p.pos);
            if (d < minDist && d <= maxRange ** 2) {
                minDist = d;
                closest = p;
            }
        }
        return closest;
    },

    isVisible(bot: Player, player: Player | undefined) {
        return player ? this.getPlayers(bot, true).includes(player) : false;
    },

    getCollidingObstacles(bot: Player, needDestructible = false, noExplosive = true) {
        const coll = collider.createCircle(bot.posOld, bot.rad * 2);
        let obs = bot.game.grid.intersectCollider(coll).filter(
            (obj): obj is Obstacle => obj.__type === ObjectType.Obstacle && !obj.dead && !obj.destroyed && obj.collidable
        );

        const collSmall = collider.createCircle(bot.posOld, bot.rad * 1.1);
        obs = obs.filter(obj => collider.intersect(collSmall, obj.collider));

        obs = needDestructible
            ? obs.filter(obj => obj.destructible && !(MapObjectDefs[obj.type] as ObstacleDef).armorPlated && !(MapObjectDefs[obj.type] as ObstacleDef).stonePlated && !(MapObjectDefs[obj.type] as ObstacleDef).explosion)
            : obs;
        
        return noExplosive ? obs.filter(obj => !(MapObjectDefs[obj.type] as ObstacleDef).explosion) : obs;
    },

    getPrefDist(g: string) {
        if (gunDist[g]) return gunDist[g];

        const zm = GameConfig.scopeZoomRadius.desktop;
        const d = GunDefs[g];
        if (!d) return new minMax(0, 0);

        if (d.isLauncher || d.name.includes("flare"))
            return gunDist[g] = new minMax(zm["2xscope"], zm["4xscope"] * 1.2);

        if (d.ammo !== "12gauge") {
            const b = BulletDefs[d.bulletType];
            if (b.speed < 100)
                return gunDist[g] = new minMax(zm["1xscope"] * 0.25, b.distance * 0.9);
            else
                return gunDist[g] = new minMax(zm["2xscope"] * 1.2, zm["8xscope"] * 1.25);
        }

        if (d.name === "spas12")
            return gunDist[g] = new minMax(zm["1xscope"], zm["4xscope"] * 1.2);

        if (d.name === "m1014")
            return gunDist[g] = new minMax(zm["2xscope"] * 0.9, (zm["4xscope"] + zm["8xscope"]) / 2);

        return gunDist[g] = new minMax(5, zm["2xscope"]);
    },
};

const gunDist: Record<string, minMax> = {};

export class minMax {
    constructor(public min: number, public max: number) {}
}
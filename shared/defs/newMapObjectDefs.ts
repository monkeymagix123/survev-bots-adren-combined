import { collider } from "../utils/collider";
import { util } from "../utils/util";
import { v2 } from "../utils/v2";
import type {
    BuildingDef,
    LootSpawnDef,
    MapObjectDef,
    ObstacleDef,
    StructureDef,
} from "./mapObjectsTyping";

function tierLoot(tier: string, min: number, max: number, props?: LootSpawnDef["props"]) {
    props = props || {};
    return {
        tier,
        min,
        max,
        props,
    };
}

function createCrate<T extends ObstacleDef>(e: Partial<T>): T {
    const t = {
        type: "obstacle",
        obstacleType: "crate",
        scale: { createMin: 1, createMax: 1, destroy: 0.5 },
        collision: collider.createAabbExtents(v2.create(0, 0), v2.create(2.25, 2.25)),
        height: 0.5,
        collidable: true,
        destructible: true,
        health: 75,
        hitParticle: "woodChip",
        explodeParticle: "woodPlank",
        reflectBullets: false,
        loot: [tierLoot("tier_world", 1, 1)],
        map: { display: true, color: 6697728, scale: 0.875 },
        terrain: { grass: true, beach: true, riverShore: true },
        img: {
            sprite: "map-crate-01.img",
            residue: "map-crate-res-01.img",
            scale: 0.5,
            alpha: 1,
            tint: 0xffffff,
            zIdx: 10,
        },
        sound: {
            bullet: "wood_crate_bullet",
            punch: "wood_crate_bullet",
            explode: "crate_break_02",
            enter: "none",
        },
    };
    return util.mergeDeep(t, e || {});
}

export const NewMapObjectDefs: Record<string, MapObjectDef> = {
    loot_house: (function (e) {
        const t = {
            type: "building",
            map: {
                display: true,
                shapes: [
                    {
                        collider: collider.createAabbExtents(
                            v2.create(0, 0.5),
                            v2.create(18, 12),
                        ),
                        color: 3823128,
                    },
                    {
                        collider: collider.createAabbExtents(
                            v2.create(0, -13),
                            v2.create(17, 2),
                        ),
                        color: 6368528,
                    },
                ],
            },
            terrain: {
                grass: true,
                beach: false,
                // riverShore: true,
                // nearbyRiver: {
                //     radMin: 0.75,
                //     radMax: 1.5,
                //     facingOri: 1,
                // },
            },
            zIdx: 1,
            floor: {
                surfaces: [
                    {
                        type: "house",
                        collision: [
                            collider.createAabbExtents(v2.create(0, -1.5), v2.create(18, 14)),
                        ],
                    },
                    {
                        type: "asphalt",
                        collision: [
                            collider.createAabbExtents(v2.create(4, -14), v2.create(3, 2.5)),
                            collider.createAabbExtents(v2.create(-4, 13.5), v2.create(2, 1)),
                        ],
                    },
                ],
                imgs: [
                    {
                        sprite: "map-building-cabin-floor.img",
                        pos: v2.create(0, -1),
                        scale: 0.5,
                        alpha: 1,
                        tint: 0xffffff,
                    },
                ],
            },
            ceiling: {
                zoomRegions: [
                    {
                        zoomIn: collider.createAabbExtents(
                            v2.create(0, 0.5),
                            v2.create(19, 12),
                        ),
                        zoomOut: collider.createAabbExtents(
                            v2.create(0, 0.5),
                            v2.create(21, 14),
                        ),
                    },
                    {
                        zoomIn: collider.createAabbExtents(
                            v2.create(4, -13),
                            v2.create(3, 2),
                        ),
                    },
                ],
                vision: {
                    dist: 5.5,
                    width: 2.75,
                    linger: 0.5,
                    fadeRate: 6,
                },
                damage: { obstacleCount: 1 },
                imgs: [
                    {
                        sprite: "map-building-cabin-ceiling-01a.img",
                        pos: v2.create(0, 0.5),
                        scale: 0.667,
                        alpha: 1,
                        tint: 0xffffff,
                    },
                    {
                        sprite: "map-building-cabin-ceiling-01b.img",
                        pos: v2.create(4, -13),
                        scale: 0.667,
                        alpha: 1,
                        tint: 0xffffff,
                    },
                    {
                        sprite: "map-chimney-01.img",
                        pos: v2.create(13, 2),
                        scale: 0.5,
                        alpha: 1,
                        tint: 0xffffff,
                        removeOnDamaged: true,
                    },
                ],
            },
            occupiedEmitters: [
                {
                    type: "cabin_smoke_parent",
                    pos: v2.create(0, 0),
                    rot: 0,
                    scale: 1,
                    layer: 0,
                    parentToCeiling: true,
                },
            ],
            mapObjects: [
                {
                    type: "brick_wall_ext_12",
                    pos: v2.create(-12, 12),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "house_door_01",
                    pos: v2.create(-2, 12.25),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "brick_wall_ext_12",
                    pos: v2.create(4, 12),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "house_window_01",
                    pos: v2.create(11.5, 12.25),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "brick_wall_ext_5",
                    pos: v2.create(15.5, 12),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "brick_wall_ext_6",
                    pos: v2.create(-18.5, 9.5),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "house_window_01",
                    pos: v2.create(-18.75, 5),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "brick_wall_ext_6",
                    pos: v2.create(-18.5, 0.5),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "house_window_01",
                    pos: v2.create(-18.75, -4),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "brick_wall_ext_6",
                    pos: v2.create(-18.5, -8.5),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "brick_wall_ext_5",
                    pos: v2.create(-15.5, -11),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "house_window_01",
                    pos: v2.create(-11.5, -11.25),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "brick_wall_ext_12",
                    pos: v2.create(-4, -11),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "house_door_01",
                    pos: v2.create(2, -11.25),
                    scale: 1,
                    ori: 3,
                },
                {
                    type: "brick_wall_ext_12",
                    pos: v2.create(12, -11),
                    scale: 1,
                    ori: 1,
                },
                {
                    type: "brick_wall_ext_15",
                    pos: v2.create(18.5, 5),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "house_window_01",
                    pos: v2.create(18.75, -4),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "brick_wall_ext_6",
                    pos: v2.create(18.5, -8.5),
                    scale: 1,
                    ori: 0,
                },
                {
                    type: "",
                    pos: v2.create(-1, -13.5),
                    scale: 0.9,
                    ori: 0,
                },
            ],
        };
        t.mapObjects.push({
            type: "loot_tier_B",
            pos: v2.create(0, 0),
            scale: 1,
            ori: 0,
        },)
        return util.mergeDeep(t, e || {});
    })({}),
    loot_tier_A: createCrate({
        health: 1,
        loot: [
            tierLoot("tier_world", 90, 90, {
                preloadGuns: true,
            }),
            // tierLoot("tier_airdrop_rare", 2, 2, {
            //     preloadGuns: true,
            // }),
            tierLoot("tier_airdrop_uncommon", 10, 10, {
                preloadGuns: true,
            }),
        ],
        terrain: { grass: true, beach: true, riverShore: true },
    }),
    loot_tier_B: createCrate({
        health: 1,
        loot: [
            tierLoot("tier_world", 90, 90, {
                preloadGuns: true,
            }),
            // tierLoot("tier_airdrop_rare", 2, 2, {
            //     preloadGuns: true,
            // }),
            tierLoot("tier_airdrop_uncommon", 2, 2, {
                preloadGuns: true,
            }),
        ],
        terrain: { grass: true, beach: true, riverShore: true },
    }),
}
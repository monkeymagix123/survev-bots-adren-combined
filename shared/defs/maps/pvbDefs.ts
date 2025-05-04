import { util } from "../../utils/util";
import type { MapDef } from "../mapDefs";
import { Main, type PartialMapDef } from "./baseDefs";
import { v2 } from "../../utils/v2";

const switchToSmallMap = true;

const x = {
    mapGen: {
        places: [
            {
                name: "The Killpit",
                pos: v2.create(0.53, 0.64),
            },
            {
                name: "Sweatbath",
                pos: v2.create(0.84, 0.18),
            },
            {
                name: "Tarkhany",
                pos: v2.create(0.15, 0.11),
            },
            {
                name: "Ytyk-Kyuyol",
                pos: v2.create(0.25, 0.42),
            },
            {
                name: "Todesfelde",
                pos: v2.create(0.81, 0.85),
            },
            {
                name: "Pineapple",
                pos: v2.create(0.21, 0.79),
            },
            {
                name: "Fowl Forest",
                pos: v2.create(0.73, 0.47),
            },
            {
                name: "Ranchito Pollo",
                pos: v2.create(0.53, 0.25),
            },
        ],
        customSpawnRules: {
            locationSpawns: [
                {
                    type: "club_complex_01",
                    pos: v2.create(0.5, 0.5),
                    rad: 150,
                    retryOnFailure: true,
                },
            ],
            placeSpawns: ["warehouse_01", "house_red_01", "house_red_02", "barn_01"],
        },
        densitySpawns: [
            {
                stone_01: 350,
                barrel_01: 76,
                silo_01: 8,
                crate_01: 50,
                crate_02: 4,
                crate_03: 8,
                bush_01: 78,
                cache_06: 12,
                tree_01: 320,
                hedgehog_01: 24,
                container_01: 5,
                container_02: 5,
                container_03: 5,
                container_04: 5,
                shack_01: 7,
                outhouse_01: 5,
                loot_tier_1: 24,
                loot_tier_beach: 4,
            },
        ],
        importantSpawns: ["club_complex_01"],
    },
    /* STRIP_FROM_PROD_CLIENT:END */
};

const config = {
    mapSize: switchToSmallMap ? "small" : "large",
    places: 3,
    mapWidth: { large: 280, small: 240 },
    spawnDensity: { large: 44, small: 37 },
} as const;

let a = x.mapGen.densitySpawns.reduce(
    (array, item) => {
        let object: Record<string, number> = {};
        for (const [key, value] of Object.entries(item)) {
            object[key] =
                (value * config.spawnDensity[config.mapSize]) / 100;
        }
        array.push(object);
        return array;
    },
    [] as Record<string, number>[]);

let b = Array(config.places)
    .fill(false)
    .map(() => {
        return x.mapGen?.places[
            Math.floor(Math.random() * x.mapGen.places.length)
        ];
    });

const mapDef: PartialMapDef = {
    mapGen: {
        map: {
            baseWidth: config.mapWidth[config.mapSize],
            baseHeight: config.mapWidth[config.mapSize],
            shoreInset: 40,
            rivers: {
                lakes: [],
                weights: [{ weight: 0.1, widths: [0] }],
            },
        },
        places: b,
        // densitySpawns: [{}],
        densitySpawns: a,
        fixedSpawns: [
            {
                club_complex_01: 1,
                // small is spawn count for solos and duos, large is spawn count for squads
                warehouse_01: { odds: 0.5 },
                house_red_01: config.mapSize === "large" ? 1 : { odds: 0.5 },
                // house_red_02: 1,
                // barn_01: { small: 1, large: 3 },
                // barn_02: 1,
                hut_01: 2,
                hut_02: 1, // spas hut
                hut_03: 1, // scout hut
                greenhouse_01: 1,
                cache_01: 1,
                cache_02: { odds: 0.8 }, // mosin tree
                cache_07: 1,
                // bunker_structure_01: { odds: 0.05 },
                bunker_structure_02: config.mapSize === "large" ? 1 : 0,
                // bunker_structure_03: 1,
                // bunker_structure_04: 1,
                // bunker_structure_05: 1,
                // warehouse_complex_01: 1,
                chest_01: 1,
                chest_03: { odds: 0.2 },
                mil_crate_02: { odds: 0.4 },
                mil_crate_03: config.mapSize === "large" ? { odds: 0.4 } : 0,
                stone_04: 1,
                tree_02: 3,
                teahouse_complex_01su: { odds: 0.5 },
                // stone_04: 1,
                loot_house: 2,
            },
        ],
        randomSpawns: [
            {
                spawns: [
                    "mansion_structure_01",
                    // "warehouse_complex_01",
                    "police_01",
                    "bank_01",
                ],
                choose: config.mapSize === "large" ? 2 : 1,
            },
        ],
    },
    gameMode: {
        maxPlayers: 80,
        pvbMode: true,
    }
    /* STRIP_FROM_PROD_CLIENT:END */
};

export const Pvb = util.mergeDeep({}, Main, mapDef) as MapDef;

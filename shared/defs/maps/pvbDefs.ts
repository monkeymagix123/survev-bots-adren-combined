import { util } from "../../utils/util";
import type { MapDef } from "../mapDefs";
import { Main, type PartialMapDef } from "./baseDefs";

const switchToSmallMap = true;

const config = {
    mapSize: switchToSmallMap ? "small" : "large",
    places: 3,
    mapWidth: { large: 280, small: 240 },
    spawnDensity: { large: 44, small: 37 },
} as const;

const mapDef: PartialMapDef = {
    // mapGen: {
    //     densitySpawns: [
    //         {
    //             stone_01: 350,
    //             barrel_01: 76,
    //             silo_01: 8,
    //             crate_01: 50,
    //             crate_02: 4,
    //             crate_03: 8,
    //             bush_01: 78,
    //             cache_06: 12,
    //             tree_07sp: 300,
    //             tree_08sp: 30,
    //             tree_08spb: 30,
    //             tree_07spr: 160,
    //             tree_08spr: 80,
    //             hedgehog_01: 24,
    //             container_01: 5,
    //             container_02: 5,
    //             container_03: 5,
    //             container_04: 5,
    //             shack_01: 7,
    //             outhouse_01: 5,
    //             loot_tier_1: 24,
    //             loot_tier_beach: 4,
    //         },
    //     ],
    //     fixedSpawns: [
    //         {
    //             warehouse_01: 2,
    //             house_red_01: { small: 2, large: 3 },
    //             house_red_02: { small: 2, large: 3 },
    //             barn_01: { small: 1, large: 3 },
    //             barn_02: 1,
    //             hut_01: 3,
    //             hut_02: 1,
    //             hut_03: 1,
    //             shack_03a: 2,
    //             shack_03b: { small: 2, large: 3 },
    //             greenhouse_01: 1,
    //             cache_01: 1,
    //             cache_02sp: 1,
    //             cache_07: 1,
    //             bunker_structure_01: { odds: 0.05 },
    //             bunker_structure_02: 1,
    //             bunker_structure_03: 1,
    //             bunker_structure_04: 1,
    //             bunker_structure_05: 1,
    //             warehouse_complex_01: 1,
    //             chest_01: 1,
    //             chest_03: { odds: 0.2 },
    //             mil_crate_02: { odds: 0.25 },
    //             tree_02: 3,
    //             teahouse_01: { small: 2, large: 3 },
    //             stone_04: 1,
    //             club_complex_01: 1,
    //         },
    //     ],
    //     spawnReplacements: [{ tree_01: "tree_07sp" }],
    // },
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
        places: Array(config.places)
            .fill(false)
            .map(() => {
                return Main.mapGen?.places[
                    Math.floor(Math.random() * Main.mapGen.places.length)
                ];
            }),
        // densitySpawns: [{}],
        densitySpawns: Main.mapGen.densitySpawns.reduce(
            (array, item) => {
                let object: Record<string, number> = {};
                for (const [key, value] of Object.entries(item)) {
                    object[key] =
                        (value * config.spawnDensity[config.mapSize]) / 100;
                }
                array.push(object);
                return array;
            },
            [] as Record<string, number>[],
        ),
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

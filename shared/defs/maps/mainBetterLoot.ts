import { util } from "../../utils/util";
import type { MapDef } from "../mapDefs";
import { Main, type PartialMapDef } from "./baseDefs";

let gunsResurviv =    [ //Pistol:
"m9",
"m9_dual",
// "hud-m9_dual",
"m93r",
"m93r_dual",
// "hud_m93r_dual",
"glock",
"glock_dual",
// "hud_glock_dual",
"p30l",
"p30l_dual",
// "ot38",
// "ot38_dual",
// "ots38_dual",
// "ots38",
"deagle",
"deagle_dual",
"colt45",
"colt45_dual",
"m1911",
"m1911_dual",

//Submachine Guns (SMG):
"mp5",
"mac10",
"ump9",
"vector",
"scorpion",

//Shotguns:
"m870",
"m1100",
// "m1014",
"mp220",
// "saiga",
"spas12",

//Sniper Rifles:
"mosin",
"m39",
// "garand",
"svd",
"vss",
"scout_elite",
"model94",

//Assault Rifles:
"scar",
"an94",
"groza",
"grozas",
"famas",
"hk416",
"m4a1",
"mk12",
// "scarssr",

//Light Machine Guns (LMG):
"dp28",
"qbb97",
"l86",
"bar",

//Others:
"blr",
"m1a1",
// "bugle",

// // post-kong
// "m134",
// "pkm",
// // "potato_cannon",
// "snow_cannon",
// "m79",
]

let genResurviv = new Array<{
    name: string;
    count: number;
    weight: number;
}>

gunsResurviv.forEach(g => {
    genResurviv.push({ name: g, count: 1, weight: 1 });
})

const mapDef: PartialMapDef = {
    lootTable: {
        // no bad ones
        tier_guns: [
            // // { name: "famas", count: 1, weight: 0.9 },
            // // { name: "hk416", count: 1, weight: 4 },
            // // { name: "mk12", count: 1, weight: 0.1 },
            // { name: "pkp", count: 1, weight: 0.005 },
            // { name: "m249", count: 1, weight: 0.006 },
            // // { name: "ak47", count: 1, weight: 2.7 },
            // { name: "scar", count: 1, weight: 0.01 },
            // // { name: "dp28", count: 1, weight: 0.5 },
            // { name: "mosin", count: 1, weight: 0.1 },
            // // { name: "m39", count: 1, weight: 0.1 },
            // { name: "ump9", count: 1, weight: /* 3 */ 1 },
            // { name: "mp220", count: 1, weight: /* 2 */ 1 },
            // { name: "saiga", count: 1, weight: 0.1 },
            // { name: "deagle", count: 1, weight: 0.05 },
            // { name: "vector", count: 1, weight: 0.01 },
            // { name: "sv98", count: 1, weight: 0.01 },
            // { name: "spas12", count: 1, weight: 1 },
            // { name: "qbb97", count: 1, weight: 0.01 },
            // { name: "flare_gun", count: 1, weight: 0.145 }, // !
            // { name: "flare_gun_dual", count: 1, weight: 0.0025 }, // !
            // { name: "groza", count: 1, weight: 0.8 },
            // { name: "scout_elite", count: 1, weight: 0.05 },
            // { name: "vss", count: 1, weight: 0.05 }, // !
            // { name: "tier_resurviv", count: 1, weight: 25 },
            // { name: "saiga", count: 1, weight: 5 },
            // { name: "sv98", count: 1, weight: 5 },
            { name: "tier_good", count: 1, weight: 1 }
        ],
        tier_resurviv: genResurviv,
        tier_good: [
            // { name: "pkp", count: 1, weight: 0.005 },
            // { name: "m249", count: 1, weight: 0.006 },
            // { name: "saiga", count: 1, weight: 0.1 },
            // { name: "sv98", count: 1, weight: 0.01 },
            // { name: "flare_gun", count: 1, weight: 0.145 }, // !
            // { name: "flare_gun_dual", count: 1, weight: 0.0025 }, // !
            { name: "pkp", count: 1, weight: 0.5 },
            { name: "m249", count: 1, weight: 0.6 },
            // { name: "saiga", count: 1, weight: 1 },
            // { name: "sv98", count: 1, weight: 1 },
            { name: "flare_gun", count: 1, weight: 0.145 }, // !
            { name: "flare_gun_dual", count: 1, weight: 0.0025 }, // !
            // add m134, pkm, m79 later
            { name: "m134", count: 1, weight: 10 },
            { name: "pkm", count: 1, weight: 10 },
            { name: "m79", count: 1, weight: 10 },
            { name: "snow_cannon", count: 1, weight: 10 },
        ],
        tier_chest: [
            // { name: "famas", count: 1, weight: 1.15 },
            // { name: "hk416", count: 1, weight: 4 },
            // { name: "mk12", count: 1, weight: 0.55 },
            { name: "m249", count: 1, weight: 0.07 },
            // { name: "ak47", count: 1, weight: 4 },
            { name: "scar", count: 1, weight: 0.27 },
            // { name: "dp28", count: 1, weight: 0.55 },
            { name: "mosin", count: 1, weight: 0.55 },
            // { name: "m39", count: 1, weight: 0.55 },
            { name: "saiga", count: 1, weight: 0.26 },
            { name: "mp220", count: 1, weight: 1.5 },
            { name: "deagle", count: 1, weight: 0.15 },
            { name: "vector", count: 1, weight: 0.1 },
            { name: "sv98", count: 1, weight: 0.1 },
            { name: "spas12", count: 1, weight: 1 },
            { name: "groza", count: 1, weight: 1.15 },
            { name: "helmet02", count: 1, weight: 1 },
            { name: "helmet03", count: 1, weight: 0.25 },
            { name: "chest02", count: 1, weight: 1 },
            { name: "chest03", count: 1, weight: 0.25 },
            { name: "4xscope", count: 1, weight: 0.5 },
            { name: "8xscope", count: 1, weight: 0.25 },
        ],
    },
};

export const MainBetterLoot = util.mergeDeep({}, Main, mapDef) as MapDef;
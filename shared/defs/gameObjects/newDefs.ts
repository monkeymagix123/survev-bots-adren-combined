import { BulletDef } from "./bulletDefs"
import { GunDef } from "./gunDefs"
import { PerkDef } from "./perkDefs";
import { ThrowableDef } from "./throwableDefs";

export const newGunDefs: Record<string, GunDef> = {
    // post-kong guns, from wiki
    m134: {
        name: "M134",
        type: "gun",
        quality: 1,
        fireMode: "auto",
        caseTiming: "shoot",
        ammo: "762mm",
        ammoSpawnCount: 200,
        maxClip: 200,
        maxReload: 200,
        extendedClip: 250,
        extendedReload: 250,
        reloadTime: 8,
        fireDelay: 0.055,
        switchDelay: 0.9,
        barrelLength: 4.8,
        barrelOffset: 0,
        recoilTime: 1e10,
        moveSpread: 2,
        shotSpread: 1,
        bulletCount: 1,
        bulletType: "bullet_m134", // supposed to be bullet_m134
        headshotMult: 1.5,
        speed: { equip: -3, attack: -6 }, // i think
        lootImg: {
            sprite: "loot-weapon-m134.png", // obv wrong
            tint: 65280,
            border: "loot-circle-outer-01.img",
            borderTint: 0,
            scale: 0.3, //????
        },
        // hmm
        worldImg: {
            // sprite: "gun-pkp-top-01.img",
            sprite: "gun-m134-01.img",
            scale: { x: 0.5, y: 0.5 },
            tint: 0xffffff,
            leftHandOffset: { x: 12.5, y: 0 },
            recoil: 1.33,
            // magImg: {
            //     sprite: "gun-pkp-bot-01.img",
            //     pos: { x: 0, y: -17.5 },
            // },
        },
        // no clue
        particle: {
            shellScale: 1,
            shellOffset: 0.5875,
            shellReverse: true,
        },
        // no clue
        sound: {
            shoot: "pkp_01",
            reload: "pkp_reload_01",
            pickup: "gun_pickup_01",
            empty: "empty_fire_02",
            deploy: "pkp_switch_01",
        },
    },
    pkm: {
        name: "PKM",
        type: "gun",
        quality: 1,
        fireMode: "auto",
        caseTiming: "shoot",
        ammo: "762mm",
        ammoSpawnCount: 200,
        maxClip: 100,
        maxReload: 100,
        extendedClip: 200,
        extendedReload: 200,
        reloadTime: 6,
        fireDelay: 0.1,
        switchDelay: 0.75,
        barrelLength: 3.6,
        barrelOffset: 0,
        recoilTime: 1e10,
        moveSpread: 10,
        shotSpread: 2.5,
        bulletCount: 1,
        bulletType: "bullet_pkm",
        headshotMult: 2,
        speed: { equip: 0, attack: -5 }, // i think
        lootImg: {
            sprite: "loot-weapon-pkm.png", // obv wrong
            tint: 65280,
            border: "loot-circle-outer-01.img",
            borderTint: 0,
            scale: 0.3, //????
        },
        // hmm
        worldImg: {
            // sprite: "gun-pkp-top-01.img",
            sprite: "gun-pkm-01.img",
            scale: { x: 0.5, y: 0.5 },
            tint: 0xffffff,
            leftHandOffset: { x: 12.5, y: 0 },
            recoil: 1.33,
            // magImg: {
            //     sprite: "gun-pkp-bot-01.img",
            //     pos: { x: 0, y: -17.5 },
            // },
        },
        // no clue
        particle: {
            shellScale: 1,
            shellOffset: 0.5875,
            shellReverse: true,
        },
        // no clue
        sound: {
            shoot: "pkp_01",
            reload: "pkp_reload_01",
            pickup: "gun_pickup_01",
            empty: "empty_fire_02",
            deploy: "pkp_switch_01",
        },
    },
    m79: {
        name: "M79",
        type: "gun",
        quality: 1,
        fireMode: "single",
        caseTiming: "shoot",
        isLauncher: true,
        noPotatoSwap: true,
        // ammo: "potato_ammo",
        // ammo: "762mm", // not right
        ammo: "40mm",
        ammoSpawnCount: 10,
        maxClip: 1,
        maxReload: 1,
        extendedClip: 1,
        extendedReload: 1,
        reloadTime: 2.3,
        fireDelay: 1.2, // unknown
        switchDelay: 0.9,
        barrelLength: 2,
        barrelOffset: -1, // copied from potato cannon
        // barrelOffset: 0, // ????
        recoilTime: 1e10,
        moveSpread: 3,
        shotSpread: 1, // done
        bulletCount: 1,
        bulletType: "bullet_invis", // just invisible
        // projType: "potato_cannonball", // ???
        projType: "bullet_m79",
        noSplinter: true,
        headshotMult: 1,
        speed: { equip: 0, attack: 0 },
        lootImg: {
            sprite: "loot-weapon-m79.png",
            tint: 65280,
            border: "loot-circle-outer-01.img",
            borderTint: 0,
            scale: 0.3,
        },
        worldImg: {
            sprite: "gun-m79-01.img",
            scale: { x: 0.5, y: 0.5 },
            tint: 0xffffff,
            leftHandOffset: { x: 7, y: 2 },
            gunOffset: { x: -10, y: -4 },
            recoil: 8,
            handsBelow: true,
        },
        particle: {
            shellScale: 1,
            shellOffset: -1,
            shellOffsetY: 1,
        },
        sound: {
            shoot: "potato_cannon_01",
            reload: "potato_cannon_reload_01",
            pickup: "gun_pickup_01",
            empty: "empty_fire_01",
            deploy: "potato_cannon_switch_01",
        },
    },


    // completely new stuff
    snow_cannon: {
        name: "Snowball Cannon",
        type: "gun",
        quality: 0,
        fireMode: "auto",
        caseTiming: "shoot",
        noPotatoSwap: true,
        ammo: "potato_ammo",
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 3.25,
        barrelOffset: 0,
        recoilTime: 1e10,
        moveSpread: 4,
        shotSpread: 3,
        bulletCount: 1,
        bulletType: "bullet_invis",
        // projType: "potato_smgshot",
        projType: "snowball_heavy",
        noSplinter: true,
        headshotMult: 2,
        speed: { equip: 0, attack: 0 },
        lootImg: {
            sprite: "loot-weapon-potato-smg.img",
            tint: 65280,
            border: "loot-circle-outer-01.img",
            borderTint: 0,
            scale: 0.3,
        },
        worldImg: {
            sprite: "gun-potato-smg-01.img",
            scale: { x: 0.5, y: 0.5 },
            tint: 0xffffff,
            recoil: 2,
            magImg: {
                sprite: "gun-potato-smg-top-01.img",
                pos: { x: 0, y: -15 },
                top: true,
            },
        },
        particle: {
            shellScale: 1,
            shellOffset: 0.1,
            shellReverse: true,
            shellOffsetY: -1.1,
        },
        sound: {
            shoot: "potato_smg_01",
            reload: "potato_smg_reload_01",
            pickup: "gun_pickup_01",
            empty: "empty_fire_01",
            deploy: "potato_smg_switch_01",
        },
    },
}

export const newBulletDefs: Record<string, BulletDef> = {
    // post-kong
    bullet_m134: {
        type: "bullet",
        damage: 10,
        obstacleDamage: 5,
        falloff: 0.5,
        distance: 200,
        speed: 130,
        variance: 0, // ?????
        shrapnel: false,
        tracerColor: "762mm",
        tracerWidth: 0.1,
        tracerLength: 0.9,
    },
    bullet_pkm: {
        type: "bullet",
        damage: 15,
        obstacleDamage: 2,
        falloff: 0.9,
        distance: 200,
        speed: 130,
        variance: 0, // ?????
        shrapnel: false,
        tracerColor: "762mm",
        tracerWidth: 0.1,
        tracerLength: 0.9,
    },
};

export const newThrowableDefs: Record<string, ThrowableDef> = {
    // 40mm
    bullet_m79: {
        name: "40mm",
        type: "throwable",
        quality: 0,
        explosionType: "explosion_frag", // similar stats on wiki?
        inventoryOrder: 0,
        cookable: true,
        forceMaxThrowDistance: true,
        explodeOnImpact: true,
        destroyNonCollidables: true,
        playerCollision: true,
        fuseTime: 999,
        aimDistance: 32,
        // aimDistance: 300, // ???
        rad: 1,
        throwPhysics: {
            playerVelMult: 0,
            velZ: 3,
            // speed: 65,
            speed: 30, // aaron da goat
            // speed: 35,
            spinVel: 10 * Math.PI, // wiki trivia?
            spinDrag: 1,
            fixedCollisionHeight: 0.25,
        },
        speed: { equip: 0, attack: 0 },
        lootImg: {
            sprite: "loot-throwable-potato.img",
            tint: 65280,
            border: "loot-circle-outer-01.img",
            borderTint: 0,
            scale: 0.2,
        },
        worldImg: {
            // sprite: "proj-potato-02.img",
            sprite: "proj-shell-40mm.png",
            scale: 0.2,
            tint: 0xffffff,
        },
        handImg: {},
        useThrowParticles: false,
        sound: {
            pullPin: "",
            throwing: "frag_throw_01",
            pickup: "frag_pickup_01",
            deploy: "frag_deploy_01",
        },
        trail: {
            maxLength: 25,
            width: 2.8,
            alpha: 1,
            tint: 5916214,
        },
    },
}

export const newPerkProperties = {
    speedy: {
        speedBoost: 0.35 // multiplicative -- by +35%
    },
    reloader: {
        reloadBoost: 0.25 // decrease reload time by 25%
    }
}

export const newPerkDefs: Record<string, PerkDef> = {
    speedy: {
        name: "Speedster",
        type: "perk",
        lootImg: {
            sprite: "loot-perk-speedy-gpt.png",
            tint: 0xffffff,
            border: "loot-circle-outer-03.img",
            borderTint: 0xffffff,
            scale: 0.275,
        },
        sound: {
            pickup: "perk_pickup_01",
        },
    },
    reloader: {
        name: "Faster Reload",
        type: "perk",
        lootImg: {
            sprite: "loot-perk-reloader-gpt.png",
            tint: 0xffffff,
            border: "loot-circle-outer-03.img",
            borderTint: 0xffffff,
            scale: 0.275,
        },
        sound: {
            pickup: "perk_pickup_01",
        },
    }
}
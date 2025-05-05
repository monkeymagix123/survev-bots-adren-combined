import * as fs from "fs";
import * as net from "../../shared/net/net";
import { Buffer } from "buffer";
import * as readline from "readline";

import { Game } from "../../client/src/game";

const exportPath = "./export.log";
const importPath = "./replay.log";

// read file
const fileStream = fs.createReadStream(importPath);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
})

for await (const line of rl) {
    // Replace this with your actual packet
    if (!line.trim()) {
        continue;
    }
    const json = JSON.parse(line);
    const base64 = json.rawData;
    const buf = Buffer.from(base64, "base64");

    const stream = new net.MsgStream(buf);
    const type = stream.deserializeMsgType();
    console.log("MsgType:", net.MsgType[type] || type);

    if (type == net.MsgType.None) {
        // break;
    }

    // let g = new Game()

    // Game.m_onMsg(type, stream.getStream());

    // Now parse it depending on the type
    switch (type) {
        case net.MsgType.AliveCounts: {
            const msg = new net.JoinedMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Disconnect: {
            const msg = new net.DisconnectMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.DropItem: {
            const msg = new net.DropItemMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Edit: {
            const msg = new net.EditMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Emote: {
            const msg = new net.EmoteMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.GameOver: {
            const msg = new net.GameOverMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Input: {
            const msg = new net.InputMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Join: {
            const msg = new net.JoinMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Joined: {
            const msg = new net.JoinedMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Kill: {
            const msg = new net.KillMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Map: {
            const msg = new net.MapMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.PerkModeRoleSelect: {
            const msg = new net.PerkModeRoleSelectMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Pickup: {
            const msg = new net.PickupMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.PlayerStats: {
            const msg = new net.PlayerStatsMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.RoleAnnouncement: {
            const msg = new net.RoleAnnouncementMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        case net.MsgType.Spectate: {
            const msg = new net.SpectateMsg(); // or JoinMsg depending on where this msg comes from
            msg.deserialize(stream.getStream());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        // case net.MsgType.Update: {
        //     const msg = new net.UpdateMsg(); // or JoinMsg depending on where this msg comes from
        //     msg.deserialize(stream.getStream());
        //     fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
        //     break;
        // }

        default: {
            console.warn("Unhandled or unknown message type:", type);
            fs.appendFileSync(exportPath, "unknown message type \n");
        }
    }
};




// const base64 = undefined;
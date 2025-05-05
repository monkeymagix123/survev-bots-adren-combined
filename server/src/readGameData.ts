import * as fs from "fs";
import * as net from "../../shared/net/net";
import { Buffer } from "buffer";
import * as readline from "readline";

import { Game } from "./game/game";

// import { Creator } from "../../client/src/objects/objectPool"
import { Creator } from "./creatorStuff";

const exportPath = "./exportGame.log";
const importPath = "./gameUpdate.log";

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
        // this one weird for some reason
        case net.MsgType.Update: {
            const msg = new net.UpdateMsg();
            msg.deserialize(stream.getStream(), new Creator());
            fs.appendFileSync(exportPath, JSON.stringify(msg) + "\n");
            break;
        }

        default: {
            console.warn("Unhandled or unknown message type:", type);
            fs.appendFileSync(exportPath, "unknown message type \n");
        }
    }
};
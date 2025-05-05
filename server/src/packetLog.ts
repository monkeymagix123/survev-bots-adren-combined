// logPacketForReplay.ts
import * as fs from "fs";
import * as path from "path";

// const replayLogPath = path.join(__dirname, "replay.log");
const replayLogPath = "./replay3.log";
const gameLogPath = "./gameUpdate.log";

interface ReplayPacket {
    socketId: string;
    ip: string;
    timestamp: number;
    rawData: string; // base64 string for safe logging
}

export function logGameUpdate(packet: {
    timestamp: number;
    rawData: Buffer;
}) {
    const replayPacket = {
        timestamp: packet.timestamp,
        rawData: packet.rawData.toString("base64"), // Base64 for safe storage
    };

    fs.appendFileSync(gameLogPath, JSON.stringify(replayPacket) + "\n");
}

export function logPacketForReplay(packet: {
    socketId: string;
    ip: string;
    timestamp: number;
    rawData: Buffer;
}) {
    const replayPacket = {
        socketId: packet.socketId,
        ip: packet.ip,
        timestamp: packet.timestamp,
        rawData: packet.rawData.toString("base64"), // Base64 for safe storage
    };

    fs.appendFileSync(replayLogPath, JSON.stringify(replayPacket) + "\n");
}

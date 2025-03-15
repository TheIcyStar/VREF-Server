import { RoomData } from "./typedefs/RoomData"

export const roomMap = new Map<string, RoomData>()


// Utility functions \\
const RANDOM_KEY_LENGTH = 24
/**
 * Generates a random string
 */
export function genRandomKey(){
    const values = new Uint8Array(24)
    crypto.getRandomValues(values)

    return Array.from(values, value => String.fromCharCode((value % 58) + 65)).join("")
}
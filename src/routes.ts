import { Router } from "express"

import { roomMap, genRandomKey } from './roomManager'
import type { RoomData } from './typedefs/RoomData'

type ResponseJSON = {data: any | undefined, error: string | undefined}
let autoRoomIdIncrement = 1

export const routes = Router()

routes.get("/", (req, res) => {
    res.send(JSON.stringify({
        status: "ok",
        protocolVersion: 0
    }))
})

/**
 * Returns a room's RoomState
 */
routes.get("/rooms/:roomId", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}

    if(!roomMap.has(req.params.roomId)){
        response.error = "No such room"
        res.status(404).send(JSON.stringify(response))
        return
    }

    response.data = roomMap.get(req.params.roomId)!.roomState
    res.send(JSON.stringify(response))
})

/**
 * Create a new room with a specific ID
 */
routes.post("/rooms/:roomId/create", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}


    if(roomMap.has(req.params.roomId)){
        response.error = "Room already exists"
        res.status(404).send(JSON.stringify(response))
        return
    }

    let newRoomData: RoomData = {
        roomId: req.params.roomId,
        ownerUpdateToken: genRandomKey(),

        roomState: {
            settings: {
                xMin: -10,
                xMax: 10,
                yMin: -10,
                yMax: 10,
                zMin: -10,
                zMax: 10,
                step: 1
            },
            equations: [],
        }
    }
    roomMap.set(req.params.roomId,newRoomData)

    response.data = newRoomData
    res.send(JSON.stringify(response))
})

/**
 * Create a new room where the server decides the ID
 */
routes.post("/autocreate", (req,res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}

    while(roomMap.has(autoRoomIdIncrement.toString())){ //todo: replace with a random character generator?
        autoRoomIdIncrement++;
    }

    let newRoomData: RoomData = {
        roomId: autoRoomIdIncrement.toString(),
        ownerUpdateToken: genRandomKey(),

        roomState: {
            settings: {
                xMin: -10,
                xMax: 10,
                yMin: -10,
                yMax: 10,
                zMin: -10,
                zMax: 10,
                step: 1
            },
            equations: [],
        }
    }
    roomMap.set(autoRoomIdIncrement.toString(),newRoomData)

    response.data = newRoomData
    res.send(JSON.stringify(response))
})

/**
 * Update the state of a specific room
 * Expects a {RoomData.RoomState} json object
 */
routes.post("/rooms/:roomId/updatestate", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}

    if(!roomMap.has(req.params.roomId)){
        response.error = "No such room"
        res.status(404).send(JSON.stringify(response))
        return
    }

    let oldRoomData = roomMap.get(req.params.roomId)!
    if(req.body.key != oldRoomData.ownerUpdateToken){
        response.error = "Bad update key"
        res.status(403).send(JSON.stringify(response))
        return
    }

    let newRoomData = {...oldRoomData, roomState: req.body.roomState}
    roomMap.set(req.params.roomId, newRoomData)

    res.send({status: "ok"})
})
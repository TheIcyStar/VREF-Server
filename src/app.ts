import express from 'express'
import bodyParser from 'body-parser'
import { roomMap } from './roomManager'
import type { RoomData } from './typedefs/RoomData'

type ResponseJSON = {data: any | undefined, error: string | undefined}
let autoRoomIdIncrement = 1

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send(JSON.stringify({
        status: "ok",
        protocolVersion: 0
    }))
})

/**
 * Returns all information about a room
 */
app.get("/rooms/:roomId", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}

    if(!roomMap.has(req.params.roomId)){
        response.error = "No such room"
        res.status(404).send(JSON.stringify(response))
        return
    }

    response.data = roomMap.get(req.params.roomId)
    res.send(JSON.stringify(response))
})

/**
 * Create a new room with a specific ID
 */
app.post("/rooms/:roomId/create", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}


    if(roomMap.has(req.params.roomId)){
        response.error = "Room already exists"
        res.status(404).send(JSON.stringify(response))
        return
    }

    let newRoomData: RoomData = {
        roomId: req.params.roomId,
        ownerId: 0,
        attendeeIds: [],

        roomState: {
            equations: [],
            objects: []
        }
    }
    roomMap.set(req.params.roomId,newRoomData)

    response.data = newRoomData
    res.send(JSON.stringify(response))
})

/**
 * Create a new room where the server decides the ID
 */
app.post("/rooms/autocreate", (req,res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}

    while(roomMap.has(autoRoomIdIncrement.toString())){ //todo: replace with a random character generator?
        autoRoomIdIncrement++;
    }

    let newRoomData: RoomData = {
        roomId: autoRoomIdIncrement.toString(),
        ownerId: 0,
        attendeeIds: [],

        roomState: {
            equations: [],
            objects: []
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
app.post("/rooms/:roomId/updatestate", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}

    if(!roomMap.has(req.params.roomId)){
        response.error = "No such room"
        res.status(404).send(JSON.stringify(response))
        return
    }

    let updatedRoomState = req.body

    let newRoomData = {...roomMap.get(req.params.roomId)!, roomState: updatedRoomState}
    roomMap.set(req.params.roomId, newRoomData)

    res.send(newRoomData)
})


app.listen(port, () => {
    console.log(`Express started on port ${port}`)
})
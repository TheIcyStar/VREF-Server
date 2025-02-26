import express from 'express'
import bodyParser from 'body-parser'
import { roomMap } from './roomManager'
import type { RoomData } from './typedefs/RoomData'

type ResponseJSON = {data: any | undefined, error: string | undefined}

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
 * Create a new room
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


app.listen(port, () => {
    console.log(`Express started on port ${port}`)
})
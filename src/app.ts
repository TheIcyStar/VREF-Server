import express from 'express'
import { roomMap } from './roomManager'
import type { RoomData } from './typedefs/RoomData'

type ResponseJSON = {data: RoomData | undefined, error: string | undefined}

const app = express()
const port = process.env.PORT || 3000

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

app.post("/rooms/:roomId/create", (req, res) => {
    let newRoomData: RoomData = {
        asdf: 2
    }
    roomMap.set(req.params.roomId,newRoomData)

    res.send("success")
})



app.listen(port, () => {
    console.log(`Express started on port ${port}`)
})
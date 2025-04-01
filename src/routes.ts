import { Router } from "express"

import { roomMap, genRandomKey } from './roomManager'
import type { RoomData } from './typedefs/RoomData'

type ResponseJSON = {data: any | undefined, error: string | undefined}
let autoRoomIdIncrement = 1

export const routes = Router()

/**
 *  @swagger
 *  /:
 *    get:
 *      description: Get the server status and protocol version
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: OK
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                description: always 'ok"
 *              protocolVersion:
 *                type: number
 */
routes.get("/", (req, res) => {
    res.send(JSON.stringify({
        status: "ok",
        protocolVersion: 0
    }))
})

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: Get a room's state
 *     description: Retrieve the settings and equations of a specific room by its ID.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room
 *     responses:
 *       200:
 *         description: Successfully retrieved room state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 settings:
 *                   $ref: '#/components/schemas/GraphSettings'
 *                 equations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EquationParseTreeNode'
 *       404:
 *         description: Room not found
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
 * @swagger
 * /rooms/{roomId}/create:
 *   post:
 *     summary: Create a new room with a specific ID
 *     description: Initializes a new room with default graph settings and an empty equation list.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the new room
 *     responses:
 *       200:
 *         description: Successfully created room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomData'
 *       404:
 *         description: Room already exists
 */
routes.post("/rooms/:roomId/create", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let response: ResponseJSON = {data: undefined, error: undefined}


    if(roomMap.has(req.params.roomId)){
        response.error = "Room already exists"
        res.status(404).send(JSON.stringify(response)) //fixme: maybe this shouldn't be a 404?
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
 * @swagger
 * /autocreate:
 *   post:
 *     summary: Create a new room with an auto-generated ID
 *     description: Generates a unique room ID and initializes a room with default settings.
 *     responses:
 *       200:
 *         description: Successfully created room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomData'
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
 * @swagger
 * /rooms/{roomId}/updatestate:
 *   post:
 *     summary: Update a room's state
 *     description: Updates the settings and equations of a specific room.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: The owner update token
 *               roomState:
 *                 type: object
 *                 $ref: '#/components/schemas/RoomData'
 *     responses:
 *       200:
 *         description: Successfully updated room
 *       403:
 *         description: Invalid update key
 *       404:
 *         description: Room not found
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


/**
 * @swagger
 * components:
 *   schemas:
 *     RoomData:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *         ownerUpdateToken:
 *           type: string
 *         roomState:
 *           type: object
 *           properties:
 *             settings:
 *               $ref: '#/components/schemas/GraphSettings'
 *             equations:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EquationParseTreeNode'
 *     GraphSettings:
 *       type: object
 *       properties:
 *         xMin:
 *           type: number
 *         xMax:
 *           type: number
 *         yMin:
 *           type: number
 *         yMax:
 *           type: number
 *         zMin:
 *           type: number
 *         zMax:
 *           type: number
 *         step:
 *           type: number
 *     EquationParseTreeNode:
 *       type: object
 *       properties:
 *         token:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             type:
 *               type: number
 *         left:
 *           $ref: '#/components/schemas/EquationParseTreeNode'
 *         right:
 *           $ref: '#/components/schemas/EquationParseTreeNode'
 */
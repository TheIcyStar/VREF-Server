import request from "supertest"
import { app,server } from "../src/app"
import type { RoomData } from "../src/typedefs/RoomData"

describe("API Endpoints", () => {
    afterAll(() => {
        server.close()
    })

    describe("GET /", () => {
        it("should return OK", async () => {
            const res = await request(app)
                .get("/")
                .expect("Content-type", /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
    })

    describe("Room creation", () => {
        it("Should fail to get a non-existant room", async () => {
            const res = await request(app)
                .get("/rooms/42")
                .expect(404)

            expect(res.statusCode).toBe(404)
        })
        it("Should create a room", async () => {
            const res = await request(app)
                .post("/rooms/42/create")
                .expect("Content-type", /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
        it("Should get the newly created room", async () => {
            const res = await request(app)
                .get("/rooms/42")
                .expect("Content-type", /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
        it("Should be able to autocreate a room", async () => {
            const res = await request(app)
                .post("/autocreate")
                // .expect("Content-type", /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
    })

    describe("Room state", () => {
        it("Should update when a new state is pushed", async () => {
            const res = await request(app)
                .post("/autocreate")
                .expect("Content-type", /json/)
                .expect(200)

            const roomData = res.body.data as RoomData
            const newRoomState = {
                settings: {
                    xMin: 1,
                    xMax: 2,
                    yMin: 3,
                    yMax: 4,
                    zMin: 5,
                    zMax: 6,
                    step: 7
                },
                equations: [{
                    token: {type: 4, text: "="},
                    left: { token: {type: 1, text: "x"}, left: null, right: null },
                    right: { token: {type: 1, text: "y"}, left: null, right: null }
                }]
            }

            const res2 = await request(app)
                .post(`/rooms/${roomData.roomId}/updatestate`)
                .send({key: roomData.ownerUpdateToken, roomState: newRoomState})
                .expect(200)

            const res3 = await request(app)
                .get(`/rooms/${roomData.roomId}`)
                .expect("Content-type", /json/)
                .expect(200)

            expect(res3.body).toHaveProperty("data")
            expect(res3.body.data).toMatchObject(newRoomState)
        })
    })
})
export type RoomData = {
    roomId: string,
    ownerId: number,
    attendeeIds: number[],

    roomState: {
        equations: string[],
        objects: string[]
    }
}
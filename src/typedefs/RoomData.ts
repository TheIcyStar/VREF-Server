export type RoomData = {
    roomId: string,
    ownerId: number,
    attendeeIds: number[],

    roomState: {
        equations: Equation[],
        objects: string[]
    }
}

export type Equation = string
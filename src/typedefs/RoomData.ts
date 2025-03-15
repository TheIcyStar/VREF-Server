export type RoomData = {
    roomId: string,
    ownerUpdateToken: string,

    roomState: {
        settings: GraphSettings,
        equations: EquationParseTreeNode[],
    }
}

type Token = {text: string, type: number}

type EquationParseTreeNode = {
    token: Token,
    left: EquationParseTreeNode | null
    right: EquationParseTreeNode | null
}

type GraphSettings = {
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    zMin: number,
    zMax: number,
    step: number
}
import fs from "fs"
import path from "path"
import swaggerJSDoc from "swagger-jsdoc"

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "VREF-Server",
            version: "0",
        },
    },
    apis: [path.join(__dirname, "../routes.ts")]
}

const outPath = path.join(__dirname, "../../build/swagger.json")
fs.mkdirSync(path.join(__dirname, "../../build"), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(swaggerJSDoc(options)))
console.log(`Generated swagger schema in ${outPath}`)
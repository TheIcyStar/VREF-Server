import express from 'express'
import bodyParser from 'body-parser'
import { routes } from './routes'

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(routes)
app.listen(port, () => {
    console.log(`Express started on port ${port}`)
})
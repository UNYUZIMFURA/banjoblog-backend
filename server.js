const express = require("express")
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors")
const app = express()
const dotenv = require("dotenv")
const routes = require("./routes")
const helmet = require("helmet")

require("dotenv").config()
dotenv.config({ path: "./env" });

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Banjo Blog APIs",
            version: "1.0.0",
            description: "Banjo Blog Documentation"
        }
    },
    apis: ["./routes/index.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const PORT = process.env.PORT || 5000

// Enable package to prevent web security attacks and handle CORS related errors
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use("/api/v1",routes)


app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})
const express = require('express')
const app = express()
const {getApi, getTopics} = require('./controller')

app.get("/api", getApi)
app.get("/api/topics", getTopics)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Error Not Found"})
})

module.exports = app
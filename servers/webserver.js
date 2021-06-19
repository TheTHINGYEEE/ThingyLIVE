const express = require('express')
const logger = require('../utils/logger')
const ports = require('../utils/ports')
const { generate, hash } = require('../actions/algoUUID.js')
const app = express()

app.use(express.static(__dirname + '/client'))

var allowedIDs = []

app.get('/createuniqueid/:streamname?', (req,res) => {
    const params = req.params
    if(!params.streamname) res.send("Please specify a stream name.")
    
    const generated = generate()
    const hashed = hash('/live/' + params.streamname)
    allowedIDs.push(generated)
    console.log(generated)
    res.send(hashed)
})

app.listen(ports.client_webserver, function() {
    logger.log("Client Web Server started on port " + ports.client_webserver)
})

module.exports.webserver = app
module.exports.idsAllowed = allowedIDs

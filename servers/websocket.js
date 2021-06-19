const webSocketServer = require('websocket').server
const { generate: generateUniqueId } = require('../actions/algoUUID')
const logger = require('../utils/logger')
const ports = require('../utils/ports')
const http = require('http')
var createdHttpServer = http.createServer()

const ws = new webSocketServer({
    httpServer: createdHttpServer
})

var connectedUsers = {}
var userIdToUsernames = {}
var connectedUsernamesArr = {}

ws.on('request', function(req) {
    const userid = generateUniqueId()
    const connection = req.accept(null, req.origin)
    connection.on('message', function (data) {
        connectedUsers[userid] = connection
        var parsedJSON = JSON.parse(data.utf8Data)
        if(!(parsedJSON)) { 
            console.error("Unable to parse retrieved data from websocket...") 
        }
        switch(parsedJSON["type"]) {

            case 'watching': {

                switch(parsedJSON["action"]) {

                    case 'add-watcher': {
                        parsedJSON["type"] = "success"
                        parsedJSON["user_id"] = userid

                        // fuck this shit took ages to figure the fuck out
                        if(!userIdToUsernames[parsedJSON['title']]) userIdToUsernames[parsedJSON['title']] = {}
                        const urmomobject = userIdToUsernames[parsedJSON['title']]
                        urmomobject[userid] = parsedJSON['user_name']

                        // userIdToUsernames[userid] = parsedJSON['user_name']
                        connectedUsernamesArr[parsedJSON['title']] = []
                        connectedUsernamesArr[parsedJSON['title']].push(parsedJSON['user_name'])
                        break
                    }

                    case 'remove-watcher': {
                        delete connectedUsers[parsedJSON.user_id]
                        parsedJSON["type"] = "success"
                        const index = connectedUsernamesArr[parsedJSON['title']].indexOf(userIdToUsernames[parsedJSON['user_id']])
                        if(index > -1) {
                            connectedUsernamesArr[parsedJSON['title']].splice(index, 1)
                        }
                        delete userIdToUsernames[parsedJSON['user_id']]
                        break
                    }
                }

            }

        }
        parsedJSON["watchers"] = connectedUsernamesArr[parsedJSON['title']]
        parsedJSON["watcher_ids"] = userIdToUsernames[parsedJSON['title']]
        for(keys in connectedUsers) {
            connectedUsers[keys].sendUTF(JSON.stringify(parsedJSON))
        }
    })
})

createdHttpServer.listen(ports.websocket_watching)

createdHttpServer.on('listening', function() {
    logger.log("Node Stream Watchers Websocket Server started on port " + ports.websocket_watching)
})

module.exports.connectedUsers = connectedUsers
module.exports.userIdToUsernames = userIdToUsernames
module.exports.connectedUsernamesArr = connectedUsernamesArr
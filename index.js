const path = require('path')
const { idsAllowed: allowedIds, webserver: app } = require('./servers/webserver')
const nms = require('./servers/mediaserver')
const websocket = require('./servers/websocket')

/*
    node-media-server usage docs is so trash, i totally didnt wasted a 
    whole day trying to figure out how the signature shit works
*/

/*
    TODO for tomorrow (06/18/2021):
        1. Add quality selector on client.
        2. Test stream key signature on another laptop.
*/

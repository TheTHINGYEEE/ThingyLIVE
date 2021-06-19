var userIDtoUsername = {}
var selfUserId = ""

async function sendRemoveWatchingPacket(userid, stream_title) {
    if (!(websocketIsOpened && websocket !== null)) {
        error("Websocket not connected or not initialized.")
        return
    }

    var packet = {
        type: "watching",
        action: "remove-watcher",
        title: stream_title,
        user_id: userid
    }

    await websocket.send(JSON.stringify(packet))
}

async function play(videoElement, streamUrl, username, stream_title) {
    if (!flvjs) {
        error("FlvJS not found.")
        return
    }
    if (!flvjs.isSupported()) {
        log("FlvJS not supported.")
        return
    }
    var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: streamUrl
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();

    log("Playing on the video player...")

    var connectTimeout = 1000 * 3 // seconds
    setTimeout(function () {
        if (!(websocketIsOpened && websocket !== null)) {
            error("Websocket not connected or not initialized.")
            return
        }
        sendWatchingPacket(username, stream_title)
    }, connectTimeout)
}

// Websocket variables
var websocket = null
var websocketIsOpened = false

async function initialize_websocket(websocketURL, watching_text_element, stream_title) {
    // await or not?
    websocket = new WebSocket(websocketURL);

    stream_title = stream_title + ""
    websocket.onopen = function () {
        log("Websocket connected!\n" +
            "Connected to " + websocket.url)

        websocketIsOpened = true
    }

    websocket.onmessage = function (event) {
        log(event.data)
        var parsedJSON = JSON.parse(event.data)
        if (!(parsedJSON)) {
            error("Error retrieving data from websocket...")
            return
        }
        if (!(parsedJSON.type === "success")) {
            error("Action not successful...")
            return
        }

        if(!(parsedJSON['title'] === stream_title)) {
            log("Wrong stream information. Skipping...")
            return
        }

        userIDtoUsername = parsedJSON.watcher_ids
        var stringifiedVer = ""
        const keyset = Object.keys(userIDtoUsername)
        for (var i = 0; i < keyset.length; i++) {
            const keyValue = keyset[i]
            stringifiedVer += userIDtoUsername[keyValue] + " (" + keyValue + ")\n"
        }
        const newContent = stringifiedVer
        watching_text_element.textContent = newContent
        switch (parsedJSON.action) {
            case 'add-watcher': {
                userIDtoUsername[parsedJSON.user_id] = parsedJSON.user_name
                selfUserId = parsedJSON.user_id
                log("Added watcher...")
                break
            }
        }
    }
    websocket.onclose = function() {
        sendRemoveWatchingPacket(selfUserId, stream_title)
    }
    window.onunload = function() {
        sendRemoveWatchingPacket(selfUserId, stream_title)
    }
    window.onbeforeunload = function () {
        sendRemoveWatchingPacket(selfUserId, stream_title)
    }
}

function sendWatchingPacket(username, stream_title) {
    if (!(websocketIsOpened && websocket !== null)) {
        error("Websocket not connected or not initialized.")
        return
    }

    var packet = {
        type: "watching",
        action: "add-watcher",
        title: stream_title,
        user_name: username
    }

    websocket.send(JSON.stringify(packet))
}

const logTime = function() {
    let nowDate = new Date();
    return nowDate.toLocaleDateString() + ' ' + nowDate.toLocaleTimeString([], { hour12: false });
};

const log = (msg) => {
    console.log(logTime() + '%c [INFO] %c' + msg,  'color:green', 'color:white')
    
}

const error = (msg) => {
    console.log(logTime() + '%c [INFO] %c' + msg,  'color:red', 'color:white')
};
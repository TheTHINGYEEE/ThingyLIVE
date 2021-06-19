const MediaServer = require('node-media-server')
const ports = require('../utils/ports')

const nmsconfig = {
    rtmp: {
        port: ports.rtmp,
        chunk_size: 1e4 * 6,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: ports.http,
        webroot: './client',
        mediaroot: './recordings',
        allow_origin: '*'
    },
    https: {
        port: ports.https_port,
        key: './privatekey.pem',
        cert: './certificate.pem'
    },
    auth: {
        // play: true,
        secret: 'twitchripoff123',
        publish: true,
        api: true,
        api_user: "admin",
        api_pass: "websockets69420"
    },
    trans: {
        ffmpeg: '/usr/local/bin/ffmpeg',
        tasks: [
            {
                app: 'live',
                mp4: true,
                mp4Flags: '[movflags=frag_keyframe+empty_moov]'
            }
        ]
    },
    fission: {
        ffmpeg: '/usr/local/bin/ffmpeg',
        tasks: [
            {
                rule: 'live/*',
                model: [
                    {
                        ab: "128k",
                        vb: "1500k",
                        vs: "1280x720",
                        vf: "60",
                    },
                    {
                      ab: "96k",
                      vb: "1000k",
                      vs: "854x480",
                      vf: "30",
                    },
                    {
                      ab: "64k",
                      vb: "600k",
                      vs: "640x360",
                      vf: "30",
                    }
                ]
            }
        ]
    }
}

var nms = new MediaServer(nmsconfig)
nms.run()

module.exports = nms
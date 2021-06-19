const md5 = require('md5')

module.exports.generate = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + s4()
}

module.exports.hash = (streamid) => {
    let exp = (Date.now() / 1000 | 0) + 999999;
    let secret = 'twitchripoff123'
    const hashed = md5(streamid + '-' + exp + '-' + secret)
    const pathgen = streamid + '?sign=' + exp + '-' + hashed
    return pathgen
}
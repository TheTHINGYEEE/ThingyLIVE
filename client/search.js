function getURLParams(name){
    var r = /[?&]([^=#]+)=([^&#]*)/g,p={},match
    while(match = r.exec(window.location)) p[match[1]] = match[2]
    return p[name]
}
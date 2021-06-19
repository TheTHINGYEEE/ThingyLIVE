const chalk = require('chalk')

const logTime = () => {
    let nowDate = new Date();
    return nowDate.toLocaleDateString() + ' ' + nowDate.toLocaleTimeString([], { hour12: false });
};

const log = (...args) => {
    // node-media-server has the chalk dependency built-in
    console.log(logTime(), process.pid, chalk.bold.green('[INFO]'), ...args)
}

module.exports.log = log
module.exports.logTime = logTime
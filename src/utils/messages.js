const moment = require('moment');

const messageFormat = function (username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm:a')
    }
}

module.exports = messageFormat;
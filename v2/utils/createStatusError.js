const http = require('http');
const STATUS_CODES = http.STATUS_CODES;

function createStatusError(status) {
    const err = new Error(STATUS_CODES[status]);
    err.status = status;
    return err;
}

module.exports = createStatusError;
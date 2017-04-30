const http = require('http');
const STATUS_CODES = http.STATUS_CODES;

/**
 * Generates an error for express depending on the status code.
 * 
 * @param {number|string} status HTTP status code
 * @returns {Error}
 */
function createStatusError(status) {
    const err = new Error(STATUS_CODES[status]);
    err.status = status;
    return err;
}

module.exports = createStatusError;
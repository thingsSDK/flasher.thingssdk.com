const base64Encode = (username, password) => new Buffer(`${username}:${password}`).toString('base64');

module.exports = base64Encode;
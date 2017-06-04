const base64Encode = require('./utils/basicAuth');
const cred = process.argv.slice(2);
if (cred.length !== 2) throw new Error('Username and password not provided');
const encoded = base64Encode(cred[0], cred[1]);
console.log(encoded);
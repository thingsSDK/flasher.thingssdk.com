const cred = process.argv.slice(2);
if (cred.length !== 2) throw new Error('Username and password not provided');
const encoded = new Buffer(cred.join(':')).toString('base64');
console.log(encoded);
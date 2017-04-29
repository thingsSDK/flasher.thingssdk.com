const mongoose = require('mongoose');
const dbConfig = require('./config/database.json');

function dbConnect(env) {
    const config = dbConfig[env];
    const connection = mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database_name}`);
    const db = mongoose.connection;
    db.on("error", err => console.error(`Database env ${env}] connection error:`, err));
    db.once('open', () => console.log(`Database connected in ${env}`));
}

module.exports = dbConnect;
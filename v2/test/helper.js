process.env.NODE_ENV = 'test';

const app = require('../app');
const mongoose = require('mongoose');
const models = require('../models');

function tearDown(done) {
    if(app.get('env') === 'test') {
        const complete = () => done();
        const onError = done;
        mongoose.connection.db.dropDatabase()
        .then(complete)
        .catch(onError);
    }     
}

module.exports = {
    app,
    tearDown,
    models
};
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
// const manifestList = require('../flat/manifest-list');
const Manifest = require('../models').Manifest;

after(done => {
  Manifest.db.dropDatabase()
  .then(() => done()) 
})

describe('GET root route', () => {
  it('should return a manifest-list', done => {
  Promise.all([5,6,7,8].map(num => new Manifest(require(`../flat/esp8266/esp12/espruino/manifest.1.8${num}.json`)).save()))
  .then(() => new Manifest(require('../flat/esp8266/esp12/smartjs/manifest.json')).save())
  .then(() => {
    request(app)
      .get('/v2')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(err).to.be.null;

        const manifestList = res.body;
        expect(manifestList).to.have.property('options').that.is.an('array');

        const firmware = manifestList.options[0];
        expect(firmware).to.have.property('name').that.is.a('string');
        expect(firmware).to.have.property('versions').that.is.an('array');

        const version = firmware.versions[0];
        expect(version).to.have.all.keys(['version', 'board', 'revision', 'manifest', 'latest']);
        done();
      });
    });
  });
});

// describe('GET /:microcontroller/:firmware/:version', () => {
//   it('should return a manifest', done => {
//     request(app)
//       .get('/esp8266-esp12/espruino/manifest.1.85.json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end((err, res) => {
//         expect(res.body).to.have.property('name', 'Espruino');
//         expect(res.body).to.have.property('version', '1v85');
//         expect(res.body).to.have.property('board', 'ESP8266');
//         expect(res.body).to.have.property('revision', 'ESP-12');
//         expect(res.body).to.have.property('description', 'Official Binaries for the Espruino Runtime for the ESP8266 MCU ESP-12');
//         expect(res.body).to.have.property('download', 'http://www.espruino.com/files/espruino_1v85.zip');
//         expect(res.body).to.have.property('flash').that.is.an('array');
//         done();
//       })
//   })
// })

// describe('GET /:chipset/:revision/:firmware/:version', () => {
//   it('should return a manifest', done => {
//     request(app)
//       .get('/esp8266/esp12/espruino/manifest.1.85.json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end((err, res) => {
//         expect(res.body).to.have.property('name', 'Espruino');
//         expect(res.body).to.have.property('version', '1v85');
//         expect(res.body).to.have.property('board', 'ESP8266');
//         expect(res.body).to.have.property('revision', 'ESP-12');
//         expect(res.body).to.have.property('description', 'Official Binaries for the Espruino Runtime for the ESP8266 MCU ESP-12');
//         expect(res.body).to.have.property('download', 'http://www.espruino.com/files/espruino_1v85.zip');
//         expect(res.body).to.have.property('flash').that.is.an('array');
//         done();
//       })
//   })
// })

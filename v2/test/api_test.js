const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const manifestList = require('../flat/manifest-list');


describe('GET /', () => {
  it('should return a manifest-list', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.eql(manifestList);
        done();
      });
  });
});

describe('GET /:microcontroller/:firmware/:version', () => {
  it('should return a manifest', done => {
    request(app)
      .get('/esp8266-esp12/espruino/manifest.1.85.json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('name', 'Espruino');
        expect(res.body).to.have.property('version', '1v85');
        expect(res.body).to.have.property('board', 'ESP8266');
        expect(res.body).to.have.property('revision', 'ESP-12');
        expect(res.body).to.have.property('description', 'Official Binaries for the Espruino Runtime for the ESP8266 MCU ESP-12');
        expect(res.body).to.have.property('download', 'http://www.espruino.com/files/espruino_1v85.zip');
        expect(res.body).to.have.property('flash').that.is.an('array');
        done();
      })
  })
})
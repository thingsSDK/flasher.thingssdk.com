const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
// const manifestList = require('../../flat/manifest-list');
const Manifest = require('../../models').Manifest;

xdescribe('Routes to retrieve manifests', () => {
  before(done => {
    Promise.all([5,6,7,8].map(num => new Manifest(require(`../../flat/esp8266/esp12/espruino/manifest.1.8${num}.json`)).save()))
    .then(() => new Manifest(require('../../flat/esp8266/esp12/smartjs/manifest.json')).save())
    .then(() => {done()})
    .catch(() => {done()});
  });

  after(done => {
  Manifest.db.dropDatabase()
  .then(() => done()) 
  });

  describe('GET root route', () => {
    it('should return a manifest-list', done => {
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

  describe('GET /manifests/:id', () => {
    it('should return a manifest', done => {
      Manifest.findOne({name: 'Espruino', board: 'ESP8266', version: '1v85'}).exec()
      .then(doc => {
        request(app)
          .get(`/v2/manifests/${doc._id}`)
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
          });
      }).catch(err => done(err));
    });
  });
});

xdescribe('Routes to create, update and delete manifests', () => {
  const manifexample = {
    name: 'Gary',
    version: 'wifi',
    board: 'yatzee',
    revision: '12 point plan',
    description: 'a small, thin, pliable wafer',
    download: 'www.example.com',
    flash: [
      {
        address: '1313 Mockingbird Lane',
        path: 'righteous'
      }
    ]
  };
  describe('POST /manifests', () => {
    it('should create a new manifest', done => {
      request(app)
        .post('/v2/manifests')
        .send(manifexample)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(err).to.be.null;
          const body = res.body;
          expect(body).to.be.an('object').and.not.to.have.property('error');
          expect(body).to.have.property('id');
          Manifest.findById(body.id).exec()
          .then(doc => {
            expect(doc).to.have.property('name', 'Gary');
            expect(doc).to.have.property('version', 'wifi');
            expect(doc).to.have.property('board', 'yatzee');
            expect(doc).to.have.property('revision', '12 point plan');
            expect(doc).to.have.property('description', 'a small, thin, pliable wafer');
            expect(doc).to.have.property('download', 'www.example.com');
            expect(doc).to.have.property('flash').that.is.an.array;
            expect(doc.flash).to.have.deep.property('[0].address', '1313 Mockingbird Lane');
            expect(doc.flash).to.have.deep.property('[0].path', 'righteous');
            done();
          })
        })
    });
  });

  describe('PUT /manifests/:id', () => {
    it('should modify an existing manifest', done => {
      new Manifest(manifexample).save()
      .then(doc => {
        request(app)
          .put(`/v2/manifests/${doc._id}`)
          .send({
            name: 'Ursula', 
            flash:[
              {
                address: '1313 Mockingbird Lane',
                path:'straight and narrow'
              },
              {
                address: 'gettysburg',
                path: 'finder'
              }
            ]
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be.null;
            const body = res.body;
            expect(body).to.have.property('name', 'Ursula');
            expect(body).to.have.property('version', 'wifi');
            expect(body).to.have.property('board', 'yatzee');
            expect(body).to.have.property('revision', '12 point plan');
            expect(body).to.have.property('description', 'a small, thin, pliable wafer');
            expect(body).to.have.property('download', 'www.example.com');
            expect(body).to.have.property('flash').that.is.an.array;
            expect(body.flash).to.have.deep.property('[0].address', '1313 Mockingbird Lane');
            expect(body.flash).to.have.deep.property('[0].path', 'straight and narrow');
            expect(body.flash).to.have.deep.property('[1].address', 'gettysburg');
            expect(body.flash).to.have.deep.property('[1].path', 'finder');
            done();
          })
      })
    })
  });

  describe('DELETE /manifests/:id', () => {
    it('should delete an existing manifest', done => {
      new Manifest(manifexample).save()
      .then(doc => {
        request(app)
          .delete(`/v2/manifests/${doc._id}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be.null;
            Manifest.findById(doc._id)
            .then(doc => {
              expect(doc).to.be.null;
              done()
            })
          })
      })
      .catch(err => done(err));
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

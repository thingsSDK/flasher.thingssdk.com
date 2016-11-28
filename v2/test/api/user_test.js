const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const User = require('../../models').User;

describe('User resource', () => {
  const testUser = {
    fName: 'Harry',
    lName: 'Henderson',
    username: 'sasquach',
    password: 'watercolormemoir',
    // isAdmin: false, // don't supply this, to make sure it's set anyway
    twitter: '@harryhenderson',
    github: 'harryhenderson',
    avatarUrl: 'myspace.com/photos/clearing.png'
  };
  describe('GET /users', () => {
    it('should retrieve all users'
    //   , done => {
    //   request(app)
    //     .post('/v2/manifests')
    //     .send(manifexample)
    //     .expect('Content-Type', /json/)
    //     .expect(200)
    //     .end((err, res) => {
    //       expect(err).to.be.null;
    //       const body = res.body;
    //       expect(body).to.be.an('object').and.not.to.have.property('error');
    //       expect(body).to.have.property('id');
    //       Manifest.findById(body.id).exec()
    //       .then(doc => {
    //         expect(doc).to.have.property('name', 'Gary');
    //         expect(doc).to.have.property('version', 'wifi');
    //         expect(doc).to.have.property('board', 'yatzee');
    //         expect(doc).to.have.property('revision', '12 point plan');
    //         expect(doc).to.have.property('description', 'a small, thin, pliable wafer');
    //         expect(doc).to.have.property('download', 'www.example.com');
    //         expect(doc).to.have.property('flash').that.is.an.array;
    //         expect(doc.flash).to.have.deep.property('[0].address', '1313 Mockingbird Lane');
    //         expect(doc.flash).to.have.deep.property('[0].path', 'righteous');
    //         done();
    //       })
    //     })
    // }
    );
  });
  describe('GET /users/:id', () => {
    it('should retrieve a user by ID'
    //   , done => {
    //   request(app)
    //     .post('/v2/manifests')
    //     .send(manifexample)
    //     .expect('Content-Type', /json/)
    //     .expect(200)
    //     .end((err, res) => {
    //       expect(err).to.be.null;
    //       const body = res.body;
    //       expect(body).to.be.an('object').and.not.to.have.property('error');
    //       expect(body).to.have.property('id');
    //       Manifest.findById(body.id).exec()
    //       .then(doc => {
    //         expect(doc).to.have.property('name', 'Gary');
    //         expect(doc).to.have.property('version', 'wifi');
    //         expect(doc).to.have.property('board', 'yatzee');
    //         expect(doc).to.have.property('revision', '12 point plan');
    //         expect(doc).to.have.property('description', 'a small, thin, pliable wafer');
    //         expect(doc).to.have.property('download', 'www.example.com');
    //         expect(doc).to.have.property('flash').that.is.an.array;
    //         expect(doc.flash).to.have.deep.property('[0].address', '1313 Mockingbird Lane');
    //         expect(doc.flash).to.have.deep.property('[0].path', 'righteous');
    //         done();
    //       })
    //     })
    // }
    );
  });
  describe('POST /users', () => {
    it('should create a new user'
    //   , done => {
    //   request(app)
    //     .post('/v2/manifests')
    //     .send(manifexample)
    //     .expect('Content-Type', /json/)
    //     .expect(201)
    //     .end((err, res) => {
    //       expect(err).to.be.null;
    //       const body = res.body;
    //       expect(body).to.be.an('object').and.not.to.have.property('error');
    //       expect(body).to.have.property('id');
    //       Manifest.findById(body.id).exec()
    //       .then(doc => {
    //         expect(doc).to.have.property('name', 'Gary');
    //         expect(doc).to.have.property('version', 'wifi');
    //         expect(doc).to.have.property('board', 'yatzee');
    //         expect(doc).to.have.property('revision', '12 point plan');
    //         expect(doc).to.have.property('description', 'a small, thin, pliable wafer');
    //         expect(doc).to.have.property('download', 'www.example.com');
    //         expect(doc).to.have.property('flash').that.is.an.array;
    //         expect(doc.flash).to.have.deep.property('[0].address', '1313 Mockingbird Lane');
    //         expect(doc.flash).to.have.deep.property('[0].path', 'righteous');
    //         done();
    //       })
    //     })
    // }
    );
  });

  describe('PUT /users/:id', () => {
    it('should modify an existing user'
    //   , done => {
    //   new Manifest(manifexample).save()
    //   .then(doc => {
    //     request(app)
    //       .put(`/v2/manifests/${doc._id}`)
    //       .send({
    //         name: 'Ursula', 
    //         flash:[
    //           {
    //             address: '1313 Mockingbird Lane',
    //             path:'straight and narrow'
    //           },
    //           {
    //             address: 'gettysburg',
    //             path: 'finder'
    //           }
    //         ]
    //       })
    //       .expect('Content-Type', /json/)
    //       .expect(200)
    //       .end((err, res) => {
    //         expect(err).to.be.null;
    //         const body = res.body;
    //         expect(body).to.have.property('name', 'Ursula');
    //         expect(body).to.have.property('version', 'wifi');
    //         expect(body).to.have.property('board', 'yatzee');
    //         expect(body).to.have.property('revision', '12 point plan');
    //         expect(body).to.have.property('description', 'a small, thin, pliable wafer');
    //         expect(body).to.have.property('download', 'www.example.com');
    //         expect(body).to.have.property('flash').that.is.an.array;
    //         expect(body.flash).to.have.deep.property('[0].address', '1313 Mockingbird Lane');
    //         expect(body.flash).to.have.deep.property('[0].path', 'straight and narrow');
    //         expect(body.flash).to.have.deep.property('[1].address', 'gettysburg');
    //         expect(body.flash).to.have.deep.property('[1].path', 'finder');
    //         done();
    //       })
    //   })
    // }
    )
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing manifest'
    //   , done => {
    //   new Manifest(manifexample).save()
    //   .then(doc => {
    //     request(app)
    //       .delete(`/v2/manifests/${doc._id}`)
    //       .expect('Content-Type', /json/)
    //       .expect(200)
    //       .end((err, res) => {
    //         expect(err).to.be.null;
    //         Manifest.findById(doc._id)
    //         .then(doc => {
    //           expect(doc).to.be.null;
    //           done()
    //         })
    //       })
    //   })
    //   .catch(err => done(err));
    // }
    );
  });
});


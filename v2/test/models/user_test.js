const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('../../models').User;
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

xdescribe('Model', () => {
  describe('User model', () => {
    beforeEach((done) => {User.remove({}).then(()=>done())});
    after(done => {User.db.dropDatabase().then(() => done())});

    it('must save a user', done => {
      const user = new User(testUser);
      user.save()
      .then(user => {
        expect(user).to.have.property('fName', 'Harry');
        expect(user).to.have.property('lName', 'Henderson');
        expect(user).to.have.property('username', 'sasquach');
        expect(user).to.have.property('password').to.not.eql('watercolormemoir');
        expect(user).to.have.property('isAdmin', false);
        expect(user).to.have.property('twitter', '@harryhenderson');
        expect(user).to.have.property('github', 'harryhenderson');
        expect(user).to.have.property('avatarUrl', 'myspace.com/photos/clearing.png');
        done();
      })
      .catch(err => done(err));
    });

    it('must retrieve a User', done => {
      const user = new User(testUser);
      // global "saved user", because bcrypt doesn't appear to play well with promise chaining
      let savedUser;
      user.save()
        .then(user => User.find({username: user.username}))
        .then(users => {
          expect(users.length).to.eql(1);
          savedUser = users[0];
          expect(savedUser).to.have.property('password')
          expect(savedUser.password).to.not.eql('watercolormemoir');
          savedUser.comparePassword('watercolormemoir', (err, isMatch) => {
            expect(err).to.be.null;
            expect(isMatch).to.be.true;
          });
        })
        .then(() => {
          expect(savedUser).to.have.property('fName', 'Harry');
          expect(savedUser).to.have.property('lName', 'Henderson');
          expect(savedUser).to.have.property('username', 'sasquach');
          expect(savedUser).to.have.property('isAdmin', false);
          expect(savedUser).to.have.property('twitter', '@harryhenderson');
          expect(savedUser).to.have.property('github', 'harryhenderson');
          expect(savedUser).to.have.property('avatarUrl', 'myspace.com/photos/clearing.png');
          done();
        })
        .catch(err => done(err))
    })

    it('must save a hashed password') // break this into own test
  })
});
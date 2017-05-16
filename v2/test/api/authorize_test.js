const helper = require('../helper');
const request = require('supertest');
const expect = require('chai').expect;

function generateUser(done, verified) {
    const User = helper.models.User;
    const user = new User({
        fName: 'Harry',
        lName: 'Henderson',
        username: 'sasquach',
        password: 'watercolormemoir',
        twitter: '@harryhenderson',
        github: 'harryhenderson',
        avatarUrl: 'myspace.com/photos/clearing.png',
        verified
    });
    user.save().then(() => done()).catch(done);
}

describe('/authorize', () => {
    const app = helper.app;

    it('should require basic auth credentials', done => {
        request(app)
            .get('/v2/authorize')
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                const error = res.body;
                expect(error.message).to.equal('Unauthorized');
                done();
            });
    });

    describe('verified users', done => {
        before(done => generateUser(done, true));
        after(helper.tearDown);

        it('should allow users to sign in', done => {
                request(app)
                    .get('/v2/authorize')
                    .auth('sasquach', 'watercolormemoir')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        const tokenJSON = res.body;
                        expect(tokenJSON.access_token).to.be.not.null;
                        expect(typeof tokenJSON.access_token).to.equal('string');
                        done();
                    });
            }),
            it('should reject incorrect user credentials', done => {
                request(app)
                    .get('/v2/authorize')
                    .auth('sasquach', 'blatentlywrong')
                    .expect('Content-Type', /json/)
                    .expect(422)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        const json = res.body;
                        expect(json.access_token).to.be.undefined;
                        expect(json.message).to.equal('Unprocessable Entity');
                        done();
                    });
            });
    });
    describe('unverified users', done => {
        before(done => generateUser(done, false));
        after(helper.tearDown);

        it('should not be allowed to sign in', done => {
            request(app)
                .get('/v2/authorize')
                .auth('sasquach', 'watercolormemoir')
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    const error = res.body;
                    expect(error.message).to.equal('Unverified Account');
                    done();
                });
        });
    });
});
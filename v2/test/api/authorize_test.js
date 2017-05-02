const helper = require('../helper'); 
const request = require('supertest'); 
const expect = require('chai').expect; 

describe('/authorize', () =>  {
    const app = helper.app; 

    before(done =>  {
        const User = helper.models.User; 
        const user = new User( {
            fName:'Harry', 
            lName:'Henderson', 
            username:'sasquach', 
            password:'watercolormemoir', 
            twitter:'@harryhenderson', 
            github:'harryhenderson', 
            avatarUrl:'myspace.com/photos/clearing.png', 
            verified: true
        }); 
        user.save().then(() => done()).catch(done); 
    }); 
    it('should allow verified users to sign in', done =>  {
         request(app)
            .get('/v2/authorize')
            .auth('sasquach', 'watercolormemoir')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) =>  {
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
            .auth('sasquac', 'watercolormemoir')
            .expect('Content-Type', /json/)
            .expect(422)
            .end((err, res) =>  {
                expect(err).to.be.null; 
                const json = res.body;
                expect(json.access_token).to.be.undefined;
                expect(json.message).to.equal('Unprocessable Entity');
                done(); 
        }); 
    });
    after(helper.tearDown); 
}); 
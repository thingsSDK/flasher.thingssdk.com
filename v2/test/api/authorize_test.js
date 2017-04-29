const helper = require('../helper'); 

describe('/authorize', () =>  {
    before((done) =>  {
        const User = helper.models.User; 
        const user = new User( {
            fName:'Harry', 
            lName:'Henderson', 
            username:'sasquach', 
            password:'watercolormemoir', 
            // isAdmin: false, // don't supply this, to make sure it's set anyway
            twitter:'@harryhenderson', 
            github:'harryhenderson', 
            avatarUrl:'myspace.com/photos/clearing.png',
        });
        user.save().then(() => done()).catch(done);
    }); 
    it('should allow users to sign in', () =>  {
        console.log("hi")
    }), 
    after(helper.tearDown); 
}); 
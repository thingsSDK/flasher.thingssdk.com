# flasher.thingssdk.com API

## Instructions
```
git clone https://github.com/joelkraft/flasher.thingssdk.com.git
cd flasher.thingssdk.com
git checkout dev
cd v2
npm i
```
or cut 'n' paste:

`git clone https://github.com/joelkraft/flasher.thingssdk.com.git && cd flasher.thingssdk.com && git checkout dev && cd v2 && npm i`
* Run tests with `npm test` (not all currently pass)
* Set up the db and start the server with `npm run dbUp && nodemon`

## Currently Available Routes
### Manifests

VERB|ROUTE|DESCRIPTION|PROTECTION
---|----|----|---
GET|[/v2](http://localhost:3000/v2)|  directory of manifests|none
GET|/v2/manifests/:id| individual manifests by ID|none
POST|/v2/manifests|store new manifest|Must be existing user
PUT|/v2/manifests/:id|edit manifest|Must be author or admin
DELETE|/v2/manifests/:id|delete manifest|Must be author or admin

### Authorization
VERB|ROUTE|DESCRIPTION|PROTECTION
---|----|----|---
GET|/v2/authorize|obtain authorization token|Must be existing user

### Users
VERB|ROUTE|DESCRIPTION|PROTECTION
---|----|----|---
GET|/v2/users|get all users|currently unprotected
POST|/v2/users|create user|currently unprotected
GET|/v2/user|get user|currently unprotected
PUT|/v2/users/:id|edit user|currently unprotected
DELETE|/v2/users/:id|delete user|currently unprotected

## Notes

### Obtaining Auth Token
#### Step 1

base64 encode an existing username & password in the form `<username>:<password>`. You can run the utility for this from the v2 directory:
```
node encodeCred <username> <password>
```
#### Step 2
Make a GET request to `/v2/authorize`, puttin the encoded string in an `Authorization` header.

Token will expire after two hours of creation.
### Using Token
To make calls to a protected route, put the token in an `Authorization` header in the form `Bearer: <token>`.

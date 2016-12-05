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

### Signup and Authorization
VERB|ROUTE|DESCRIPTION|PROTECTION
---|----|----|---
GET|/v2/authorize|obtain authorization token|Must be existing user
POST|/v2/signup|submit new user in req.body, get verification route|none
GET|/v2/signup/:jwt|verify account, enable use of API|Must be existing user

### Users
VERB|ROUTE|DESCRIPTION|PROTECTION
---|----|----|---
GET|/v2/users|get all users|admin only
POST|/v2/users|create user|admin only
GET|/v2/user|get user|user or admin
PUT|/v2/users/:id|edit user|user or admin
DELETE|/v2/users/:id|delete user|admin only

## Notes

### Signing Up
#### Step 1
POST new user JSON to /v2/signup, in the following form
```
{
  "fName": "Brittany",
  "lName": "Brownman",
  "username": "britt",
  "password": "bearsrule",
  "twitter": "@britber",
  "github": "brittanyb",
  "avatarUrl": "google.com/images/brown/3"
}
```
#### Step 2
Click on returned link to verify account.

### Obtaining Auth Token
#### Step 1

base64 encode an existing username & password in the form `<username>:<password>`. You can run the utility for this from the v2 directory:
```
node encodeCred <username> <password>
```
#### Step 2
Make a GET request to `/v2/authorize`, putting the encoded string in an `Authorization` header.

Token will expire after two hours of creation.
### Using Token
To make calls to a protected route, put the token in an `Authorization` header in the form `Bearer: <token>`.

## Current known issues
1. Email is not collected, but will be needed. Probably use email for username.
* Unverified accounts can still get auth tokens at the moment :P
* This is all only written for a Golden Path. Not very much validation or security measures are in place, but please suggest anything you think of!
* Probably other stuff I'll think of later when my computer is in another room.

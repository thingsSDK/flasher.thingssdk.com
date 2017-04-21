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
GET|/v2|directory of published manifests|none; admins see unpublished
GET|/v2?search=text|will show manifests with 'text' (case insensitive) in 'name', 'version', 'board', 'revision', 'description', or 'download' fields|none; admins see unpublished
GET|/v2/manifests/:id| individual manifests by ID|none; if unpublished, only author or admin can use
POST|/v2/manifests|store new manifest|Must be existing user
PUT|/v2/manifests/:id|edit manifest|Must be author or admin; only admin can set 'published'
DELETE|/v2/manifests/:id|delete manifest|Must be author or admin

### User Management and Authorization
VERB|ROUTE|DESCRIPTION|PROTECTION
---|----|----|---
GET|/v2/authorize|obtain authorization token|Must be existing user
POST|/v2/signup|submit new user in req.body, get verification route|none
GET|/v2/signup/:jwt|verify account, enable authenticated use of API|Must be existing user
GET|/v2/my-account|Get own user document|Must be existing user
PUT|/v2/my-account|Modify user document|Must be existing user
DELETE|/v2/my-account|Delete user document|Must be existing user

### Users
VERB|ROUTE|DESCRIPTION|PROTECTION
---|----|----|---
GET|/v2/users|get all users|admin only
POST|/v2/users|create user|admin only
GET|/v2/user|get user|admin only
PUT|/v2/users/:id|edit user|admin only
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
* This is all only written for a Golden Path. Not very much validation or security measures are in place, but please suggest anything you think of!
# flasher.thingssdk.com API

## Instructions
```
git clone https://github.com/joelkraft/flasher.thingssdk.com.git
cd flasher.thingssdk.com
git checkout dev
cd v2
npm i
```
* or cut 'n' paste:

`git clone https://github.com/joelkraft/flasher.thingssdk.com.git && cd flasher.thingssdk.com && git checkout dev && cd v2 && npm i`
* Run tests with `npm test`
* Set up the db and start the server with `npm run dbUp && nodemon`

## Currently Available Routes

VERB|ROUTE|DESCRIPTION
---|----|----
GET|[/v2](http://localhost:3000/v2)|  directory of manifests
GET|/v2/manifests/:id| individual manifests by ID

## Notes
Enjoy!

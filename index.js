const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || `http://localhost:${port}`;

const v1_ManifestList = require('./v1.json');
const v1_1_ManifestList = require('./v1.1.json');

function prepareManifestUrls(manifestList) {
    manifestList.options = manifestList.options.map(firmware => {
        firmware.versions.map(manifest => {
            manifest.manifest = `${url}${manifest.manifest}`;
            return manifest;
        });
        return firmware;
    });
}

[v1_ManifestList, v1_1_ManifestList].forEach(prepareManifestUrls);
v1_1_ManifestList.options = v1_ManifestList.options.concat(v1_1_ManifestList.options);

app.use(cors());
app.use(express.static('public'));

app.get("/", (req,res) => res.redirect('http://thingssdk.com'));
app.get('/:api_version/manifest-list.json', (req, res) => {
    const {api_version} = req.params;
    if (api_version === "v1") {
        res.json(v1_ManifestList);
    } else if (api_version === "v1.1") {
        res.json(v1_1_ManifestList);
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});
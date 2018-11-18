const dotenv = require('dotenv')
const fs = require('fs-extra')
dotenv.config()

// Create a dist folder
const createDirectory = () => fs.mkdirp('./dist')

// Copy public contents
const copyFiles = () => fs.copy('./public', './dist')

// Generate v1 and v1.1 manifest list files
const generateAPI = () => {

    const url = process.env.URL;

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
    v1_1_ManifestList.options =
        v1_ManifestList.options
            .concat(v1_1_ManifestList.options);
    fs.writeFile('./dist/v1/manifest-list.json', JSON.stringify(v1_ManifestList))
    fs.writeFile('./dist/v1.1/manifest-list.json', JSON.stringify(v1_1_ManifestList))
}

// build
const build = () =>
    createDirectory()
        .then(copyFiles)
        .then(generateAPI)

build()
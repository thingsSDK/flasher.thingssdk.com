function composeObj(masterObj) {
    return (result, key) => {
        result[key] = masterObj[key];
        return result;
    };
}

function excludeFilter(keys) {
    return key => keys.indexOf(key) === -1;
}

function filterObject(keys, obj) {
    return Object.keys(obj)
        .filter(excludeFilter(keys))
        .reduce(composeObj(obj), {})
}

module.exports = {
    composeObj,
    excludeFilter,
    filterObject
};

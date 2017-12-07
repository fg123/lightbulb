module.exports = {
    retrieveDataset: retrieveDataset
};

var fs = require('fs'),
    path = require('path');

function retrieveDataset(name) {
    fs.readFile(path.join(__dirname, "datasets/" + name + '.json'),
        function (err, data) {
            if (!err) {
                return JSON.parse(data);
            } else {
                console.log(err);
            }
    });
}
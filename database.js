const fs = require("fs");
const stringify = require("./stringify");

const defaultDB = {
	name: "New Database",
	version: "1.0"
};

function create(path) {
	fs.writeFileSync(path, stringify(defaultDB));
}

module.exports = {
	create: create
};

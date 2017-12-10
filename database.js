const fs = require("fs");
const stringify = require("./stringify");

const defaultDB = {
	name: "New Database",
	version: "1.0",
	classes: []
};

function create(path) {
	writeDatabase(path, defaultDB);
}

function getDatabase(path) {
	var content = JSON.parse(fs.readFileSync(path, "utf-8"));
	content.path = path;
	return content;
}

function writeDatabase(path, data) {
	fs.writeFileSync(path, stringify(data));
}

function createClass(data, name) {
	data.classes.push({
		name: name,
		members: []
	});
}
module.exports = {
	create: create,
	getDatabase: getDatabase,
	writeDatabase: writeDatabase,
	createClass: createClass
};

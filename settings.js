const fs = require("fs");
const settingsFileName = "settings.json";
const stringify = require("./stringify");

var settings = {
	databases: ["./databases/lightbulb.lb"]
};

if (fs.existsSync(settingsFileName)) {
	settings = JSON.parse(fs.readFileSync(settingsFileName, "utf-8"));
	commit();
}

function commit() {
	fs.writeFileSync(settingsFileName, stringify(settings));
}

module.exports = {
	settings: settings,
	commit: commit
};

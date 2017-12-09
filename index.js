const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fs = require("fs");
const { settings, commit } = require("./settings");
const bodyParser = require("body-parser");
const database = require("./database");
const stringify = require("./stringify");


app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/client"));
var port = process.env.PORT || 5000;

http.listen(port, function() {
	console.log("Listening on " + port);
});

app.get("/", function (request, response) {
	response.sendFile("client/index.html", { root : __dirname});
});

/*
 * Returns a list of database paths saved
 * Requires: {}
 */
app.post("/db-list", function (request, response) {
	response.setHeader('Content-Type', 'application/json');
	response.send(stringify(settings.databases));
});

/*
 * Adds a path into the saved database paths, returns the new list
 * Requires: { path: pathToAdd }
 */
app.post("/db-list/add", function (request, response) {
	var path = request.body.path;
	if (settings.databases.includes(path)) {
		response.status(400);
		response.send("This path has already been added!");
		return;
	}
	settings.databases.push(path);
	commit();
	response.setHeader('Content-Type', 'application/json');
	response.send(stringify(settings.databases));
});

/*
 * Creates a new DB in the filesystem given a path
 * Requires: { path: pathToNewDB }
 */
app.post("/db-list/create", function (request, response) {
	var path = request.body.path;
	if (settings.databases.includes(path)) {
		response.status(400);
		response.send("This path has already been added!");
		return;
	}
	// Check for Creation
	if (fs.existsSync(path)) {
		response.status(400);
		response.send("File already exists!");
		return;
	}
	database.create(path);
	settings.databases.push(path);
	commit();
	response.setHeader('Content-Type', 'application/json');
	response.send(stringify(settings.databases));
});

/*
 * Get's information about a database, it's classes and it's datasets.
 * Requires: { path: pathToDb }
 */
app.post("/db/get", function (request, response) {
	// Get Database
	var path = request.body.path;
	if (!settings.databases.includes(path)) {
		response.status(400);
		response.send("Invalid Path!");
		return;
	}
	if (!fs.existsSync(path)) {
		response.status(400);
		response.send(`<code>${path}</code> file not found. Path may be invalid!`);
		return;
	}
	var content = JSON.parse(fs.readFileSync(path, "utf-8"));
	content.path = path;
	response.setHeader('Content-Type', 'application/json');
	response.send(stringify(content));
});













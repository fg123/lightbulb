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
	// TODO: Delegate this check into a helper function?
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
	response.setHeader('Content-Type', 'application/json');
	response.send(stringify(database.getDatabase(path)));
});

/*
 * Creates a class with the given name, same return as /db/get
 * Requires: { path: pathToDb, name: newClassName }
 */
app.post("/db/classes/create", function(request, response) {
	var path = request.body.path;
	if (!settings.databases.includes(path)) {
		// Really shouldn't happen...
		response.status(400);
		response.send("Unexpected invalid path!");
		return;
	}
	// Check if class already exists
	var content = database.getDatabase(path);
	if (content.classes.some((x) => x.name == request.body.name)) {
		response.status(400);
		response.send("Class name already exists!");
		return;
	}
	database.createClass(content, request.body.name);
	database.writeDatabase(path, content);
	response.setHeader('Content-Type', 'application/json');
	response.send(stringify(content));	
});










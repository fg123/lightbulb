var state = undefined;
var selectedDatabase = undefined;
var selectedDataset = undefined;

var states = {
	onload: {
		onEntry: function () {
			// Get Databases From Server
			makeServerRequest("/db-list", {}, function (data) {
				refreshDBList(data);
			});
			$("#databaseName").text("Select Database");
		},
		onExit: function () {

		}
	},
	hasSelectedDatabase: {
		onEntry: function () {
			$("#databaseName").text(pathToName(selectedDatabase.path));
			$('ul.tabs').tabs('select_tab', 'classes');

			$("ul#classList").html(`<li>
										<div class="collapsible-header" onclick="createClassModal()">
											<i class="material-icons">create</i>Create
										</div>
									</li>`);
			selectedDatabase.classes.forEach(function (element) {
				$("ul#classList").append(`
					<li>
						<div class="collapsible-header"><i class="material-icons">list</i>${element.name}</div>
						<div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
					</li>`);
			});
		},
		onExit: function () {

		}
	},
	hasSelectedDataset: {
		onEntry: function () {

		},
		onExit: function () {

		}
	}
};

function createClassModal() {
	$("#createClassModal").modal("open");
}

function changeState(newState) {
	if (state) {
		state.onExit();
	}
	state = newState;
	state.onEntry();
}

function makeServerRequest(url, data, success) {
	$.ajax({
		url: url,
		method: "POST",
		data: data,
		success: success,
		error: serverRequestError,
	});
}

function showAlert(message) {
	$("#alertModal p").html(message);
	$("#alertModal").modal("open");
}

function serverRequestError(jqXHR, exception) {
	var msg = '';
	if (jqXHR.status === 0) {
		msg = 'Not connect.\n Verify Network.';
	} else if (jqXHR.status == 404) {
		msg = 'Requested page not found. [404]';
	} else if (jqXHR.status == 500) {
		msg = 'Internal Server Error [500].';
	} else if (exception === 'parsererror') {
		msg = 'Requested JSON parse failed.';
	} else if (exception === 'timeout') {
		msg = 'Time out error.';
	} else if (exception === 'abort') {
		msg = 'Ajax request aborted.';
	} else {
		msg = jqXHR.responseText;
	}
	showAlert(msg);
}

function pathToName(path) {
	return path.split("/").slice(-1)[0].replace(/\.[^/.]+$/, "");
}

function refreshDBList(data) {
	var databases = data;
	$("ul#databases").html("");
	databases.forEach(function (element) {
		// Parse Name
		$("ul#databases").append(`<li><a href="#!" class="loadDatabase" data-path="${element}">${pathToName(element)}</a></li>`);
	});
	$("ul#databases").append('<li class="divider"></li>');
	$("ul#databases").append('<li><a href="#createDatabaseModal" class="modal-trigger">Create Database</a></li>');
	$("ul#databases").append('<li><a href="#addDatabaseModal" class="modal-trigger">Add Existing</a></li>');
}

$(document).ready(function () {
	$('.modal').modal();
	changeState(states.onload);

	$("#createClassButton").click(function () {
		var name = $("#createClassName").val();
		var path = selectedDatabase.path;
		if (name) {
			$("#createClassName").val("");
			makeServerRequest("/db/classes/create", { path: path, name: name }, 
				function (data) {
				selectedDatabase = data;
				changeState(states.hasSelectedDatabase);
			});
		}
	});
	$("#addDatabaseButton").click(function () {
		var path = $("#addDatabasePath").val();
		if (path) {
			$("#addDatabasePath").val("");
			makeServerRequest("/db-list/add", { path: path }, function (data) {
				refreshDBList(data);
			});
		}
	});
	$("#createDatabaseButton").click(function () {
		var path = $("#createDatabasePath").val();
		if (path) {
			$("#createDatabasePath").val("");
			makeServerRequest("/db-list/create", { path: path }, function (data) {
				refreshDBList(data);
			});
		}
	});
	// Delegate to dynamically created a.loadDatabase items
	$("ul#databases").on("click", "a.loadDatabase", function () {
		var path = $(this).data("path");
		makeServerRequest("/db/get", { path: path }, function (data) {
			selectedDatabase = data;
			changeState(states.hasSelectedDatabase);
		});
	});
});

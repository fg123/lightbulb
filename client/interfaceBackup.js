const datasetNames = ["structures"];
var database = {};
var selectedDataset = null;
$('#datasetSelector').change(function () {
	if (this.selectedIndex == 0) {
		selectedDataset = null;
		$(".editor").html("");
	}
	else {
		selectedDataset = this.value;
		loadEditor(database[this.value]);
	}
});
function loadEditor(schemaSet) {
	// Load Details
	$(".editor").html("");
	$(".editor").append(`
		<div class="info">
			<h4>${selectedDataset}</h4>
			<p><b>Type: </b>${schemaSet.schema}</p>
			<p><b>Primary Key: </b>${schemaSet.key}</p>
		</div>
	`);
	var table = "<table class='striped bordered'>";
	// Header Row
	table += `<thead><tr>${schemaSet.columns.reduce(function (acc, curr) {
		return acc + "<td>" + curr + "</td>";
	}, "")}</tr></thead>`;
	table += `<tbody>${
		schemaSet.rows.reduce(function (acc, curr) {
		return acc + `<tr>${
			curr.reduce(function (acc, curr) {
				if (Array.isArray(curr)) {
					return acc + "<td>" + "Edit List" + "</td>";
				} else {
					return acc + "<td>" + JSON.stringify(curr) + "</td>";
				}
				}, "")
			}</tr>`;
		}, "")
	}</tbody>`;
	table += "</table>";
	$(".editor").append(table);
}
$(document).ready(function () {
	// Load Datasets
	datasetNames.forEach(function (e) {
		$.ajax({
			dataType: "json",
			async: false,
			url: "data/" + e + ".json",
			success: function(data) {
				database[e] = data;
			}
		});
		$('#datasetSelector').append($('<option>', {
			value: e,
			text: e
		}));
	});
	$('#datasetSelector').material_select();
	console.log(database);
});

$(document).ready(readyNow);

function readyNow() {
	console.log("Testing testing 1 2 3...");
	setupClickListeners();
	// refreshTasks();

	refreshDoTasks();
	refreshScheduleTasks();
	refreshDelegateTasks();
	refreshEliminateTasks();
}

// function listens for clicks
function setupClickListeners() {
	$("#sumbitTask").click(saveTasks);
	$(".table").on("click", ".deleteButton", deleteTask);
	$(".table").on("click", ".progressStatus", updateTaskProgressStatus);
}

// on check on check box it will change it's progress_state
function updateTaskProgressStatus(event) {
	let taskID = $(event.target).closest("tr").data("task").id;
	$.ajax({
			method: "PUT",
			url: `/tasks/${taskID}`,
		})
		.then((response) => {
			// refreshTasks();
			refreshDoTasks();
			refreshScheduleTasks();
			refreshDelegateTasks();
			refreshEliminateTasks();
		})
		.catch((response) => {
			// error, notify the user:,
			alert("Request failed. Try again later.");
		});
}

// functions takes inputs and gives body to DB to store
function saveTasks() {
	console.log("In saveTasks function!");
	if (validateInputs()) {
		return false;
	}
	// values of imputs
	const taskName = $("#taskNameIn").val();
	const taskUrgenceLevel = $("#urgenceLevelIn").val();
	const taskImportanceLevel = $("#importanceLevelIn").val();
	const taskDetails = $("#taskDetailsIn").val();
	let taskMatrixStatus = '';

	if (taskUrgenceLevel === "Urgent" && taskImportanceLevel === 'Important') {
		taskMatrixStatus = 'Do';
	} else if (taskUrgenceLevel === "Non-urgent" && taskImportanceLevel === 'Important') {
		taskMatrixStatus = "Schedule";
	} else if (taskUrgenceLevel === "Urgent" && taskImportanceLevel === 'Non-important') {
		taskMatrixStatus = "Delegate";
	} else if (taskUrgenceLevel === "Non-urgent" && taskImportanceLevel === 'Non-important') {
		taskMatrixStatus = "Eliminate";
	}
	let matrixObj = {
		task_name: taskName,
		task_details: taskDetails,
		matrix_status: taskMatrixStatus,
		urgence_level: taskUrgenceLevel,
		importance_level: taskImportanceLevel,
		progress_state: "Inprogress", // Default
	};

	console.log(matrixObj);

	$.ajax({
			method: "POST",
			url: "/tasks",
			data: matrixObj,
		})
		.then(function (response) {
			// update the history
			// refreshTasks();
			refreshDoTasks();
			refreshScheduleTasks();
			refreshDelegateTasks();
			refreshEliminateTasks();
			clearInputs();
		})
		.catch(function (response) {
			// only called when server returns 4xx 5xx
			alert("something went wrong");
		});
}

// validation function for inputs
function validateInputs() {
	if (
		$("#taskNameIn").val() === "" ||
		$("#urgenceLevelIn").val() === "" ||
		$("#importanceLevelIn").val() === ""
	) {
		alert("You must fill all input fields out!");
		return true;
	}
}

// function to clear the input fields
function clearInputs() {
	$("#taskNameIn").val("");
	$("#urgenceLevelIn").val("");
	$("#importanceLevelIn").val("");
	$("#taskDetailsIn").val("");
}

// function GETs data and displays it
function refreshTasks() {
	console.log("In refreshTask function!");
	$.ajax({
		method: "GET",
		url: "/tasks/Inprogress",
	}).then(function (response) {
		// $("#doTable #doTbody").empty();
		// $("#scheduleTable #scheduleTbody").empty();
		// $("#delegateTable #delegateTbody").empty();
		// $("#eliminateTable #eliminateTbody").empty();
		let spot = 0;
		let option = null;
		for (const task of response) {
			spot++;
			let rowElement = $('<tr></tr>');
			const name = task.task_name;
			const matrixStatus = task.matrix_status;
			const progressState = task.progress_state;
			rowElement.data("task", task);
			rowElement.append(`<th scope="row">${spot}</th>`);
			rowElement.append(`<td>${name}</td>`);
			if (progressState === "Complete") {
				let checkbox = $(
						'<input type="checkbox" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", true)
					.prop("disabled", true);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			} else {
				let checkbox = $(
						'<input type="checkbox" class="progressStatus" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", false)
					.prop("disabled", false);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			}
			rowElement.append(
				`<td><button class = "btn btn-outline-danger deleteButton">X</button></td>`
			);

			// if (matrixStatus == 'Do') {
			//     console.log('Does it equal do');
			// 	option = 1;
			// } else if (matrixStatus == 'Schedule') {
			//     console.log("Does it equal schedule");
			// 	option = 2;
			// } else if (matrixStatus == 'Delegate') {
			//     console.log("Does it equal delegate");
			// 	option = 3;
			// } else if (matrixStatus == 'Eliminate') {
			//     console.log("Does it equal eliminate");
			// 	option = 4;
			// }

			// if (option === 1) {
			//   console.log("Does it equal do");
			//   $("#doTable #doTbody").append(rowElement);
			// } else if (option === 2) {
			//   console.log("Does it equal schedule");
			//   $("#scheduleTable #scheduleTbody").append(rowElement);
			// } else if (option === 3) {
			//   console.log("Does it equal delegate");
			//   $("#delegateTable #delegateTbody").append(rowElement);
			// } else if (option === 4) {
			//   console.log("Does it equal eliminate");
			//   $("#eliminateTable #eliminateTbody").append(rowElement);
			// }
		}
	});
}

// function GETs data display on the ---- Do matrix
function refreshDoTasks() {
	console.log("In refreshDoTasks function!");
	$.ajax({
		method: 'GET',
		url: '/tasks/status/Do',
	}).then(function (response) {
		$('#doTable #doTbody').empty();
		let spot = 0;
		for (let task of response) {
			spot++;
			let rowElement = $('<tr></tr>');
			const name = task.task_name;
			const progressState = task.progress_state;
			rowElement.data('task', task);
			rowElement.append(`<th scope="row">${spot}</th>`);
			rowElement.append(`<td>${name}</td>`);
			if (progressState === "Complete") {
				let checkbox = $('<input type="checkbox" aria-label="Checkbox for following text input"/>').prop("checked", true).prop("disabled", true);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			} else {
				let checkbox = $('<input type="checkbox" class="progressStatus" aria-label="Checkbox for following text input"/>').prop("checked", false).prop("disabled", false);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			}
			rowElement.append(`<td><button class = "btn btn-outline-danger deleteButton">X</button></td>`);
			$("#doTable #doTbody").append(rowElement);
		}
	});
}

// function GETs data display on the ---- Schedule matrix
function refreshScheduleTasks() {
	console.log("In refreshScheduleTasks function!");
	$.ajax({
		method: "GET",
		url: "/tasks/status/Schedule",
	}).then(function (response) {
		$("#scheduleTable #scheduleTbody").empty();
		let spot = 0;
		for (const task of response) {
			spot++;
			let rowElement = $('<tr></tr>');
			const name = task.task_name;
			const progressState = task.progress_state;
			rowElement.data("task", task);
			rowElement.append(`<th scope="row">${spot}</th>`);
			rowElement.append(`<td>${name}</td>`);
			if (progressState === "Complete") {
				let checkbox = $(
						'<input type="checkbox" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", true)
					.prop("disabled", true);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			} else {
				let checkbox = $(
						'<input type="checkbox" class="progressStatus" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", false)
					.prop("disabled", false);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			}
			rowElement.append(
				`<td><button class = "btn btn-outline-danger deleteButton">X</button></td>`
			);
			$("#scheduleTable #scheduleTbody").append(rowElement);
		}
	});
}

// function GETs data display on the ---- Delegate matrix
function refreshDelegateTasks() {
	console.log("In refreshDelegateTasks function!");
	$.ajax({
		method: "GET",
		url: "/tasks/status/Delegate",
	}).then(function (response) {
		$("#delegateTable #delegateTbody").empty();
		let spot = 0;
		for (const task of response) {
			spot++;
			let rowElement = $('<tr></tr>');
			const name = task.task_name;
			const progressState = task.progress_state;
			rowElement.data("task", task);
			rowElement.append(`<th scope="row">${spot}</th>`);
			rowElement.append(`<td>${name}</td>`);
			if (progressState === "Complete") {
				let checkbox = $(
						'<input type="checkbox" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", true)
					.prop("disabled", true);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			} else {
				let checkbox = $(
						'<input type="checkbox" class="progressStatus" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", false)
					.prop("disabled", false);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			}
			rowElement.append(
				`<td><button class = "btn btn-outline-danger deleteButton">X</button></td>`
			);
			$("#delegateTable #delegateTbody").append(rowElement);
		}
	});
}

// function GETs data display on the ---- Eliminate matrix
function refreshEliminateTasks() {
	console.log("In refreshEliminateTasks function!");
	$.ajax({
		method: "GET",
		url: "/tasks/status/Eliminate",
	}).then(function (response) {
		$("#eliminateTable #eliminateTbody").empty();
		let spot = 0;
		for (const task of response) {
			spot++;
			let rowElement = $('<tr></tr>');
			const name = task.task_name;
			const progressState = task.progress_state;
			rowElement.data("task", task);
			rowElement.append(`<th scope="row">${spot}</th>`);
			rowElement.append(`<td>${name}</td>`);
			if (progressState === "Complete") {
				let checkbox = $(
						'<input type="checkbox" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", true)
					.prop("disabled", true);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			} else {
				let checkbox = $(
						'<input type="checkbox" class="progressStatus" aria-label="Checkbox for following text input"/>'
					)
					.prop("checked", false)
					.prop("disabled", false);
				let td = $("<td></td>").append(checkbox);
				rowElement.append(td);
			}
			rowElement.append(
				`<td><button class = "btn btn-outline-danger deleteButton">X</button></td>`
			);
			$("#eliminateTable #eliminateTbody").append(rowElement);
		}
	});
}

function deleteTask(event) {
	let taskId = $(event.target).closest("tr").data("task").id;

	$.ajax({
			method: "DELETE",
			url: `/tasks/${taskId}`,
		})
		.then(function (response) {
            // refreshTasks();
            refreshDoTasks();
            refreshScheduleTasks();
            refreshDelegateTasks();
            refreshEliminateTasks();
		})
		.catch(function (error) {
			alert("Error on delete", error);
		});
}

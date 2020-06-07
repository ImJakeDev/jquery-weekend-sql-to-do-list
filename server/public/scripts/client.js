$(document).ready(readyNow);

function readyNow() {
	console.log("Testing testing 1 2 3...");
	setupClickListeners();
	refreshTasks();
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
			refreshTasks();
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

	$.ajax({
			method: "POST",
			url: "/tasks",
			data: {
				task_name: taskName,
				task_details: taskDetails,
				matrix_status: "Do",
				urgence_level: taskUrgenceLevel,
				importance_level: taskImportanceLevel,
				progress_state: "Inprogress",
			},
		})
		.then(function (response) {
			// update the history
			refreshTasks();
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
		$("#doTable #doTbody").empty();
        let spot = 0;
        let option = null;
		for (const task of response) {
			spot++;
			let rowElement = $('<tr></tr>');
			const name = task.task_name;
			const details = task.task_details;
			const matrixStatus = task.matrix_status;
			//   const urgence = task.urgence_level;
			//   const importance = task.importance_level;
			const progressState = task.progress_state;
			// What do I actually need to append in the table?
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

			if (matrixStatus == 'Do') {
                console.log('Does it equal do');
				option = 1;
			} else if (matrixStatus == 'Schedule') {
                console.log("Does it equal schedule");
				option = 2;
			} else if (matrixStatus == 'Delegate') {
                console.log("Does it equal delegate");
				option = 3;
			} else if (matrixStatus == 'Eliminate') {
                console.log("Does it equal eliminate");
				option = 4;
            }
            
            if (option === 1) {
              console.log("Does it equal do");
              $("#doTable #doTbody").append(rowElement);
            } else if (option === 2) {
              console.log("Does it equal schedule");
              $("#scheduleTable #scheduleTbody").append(rowElement);
            } else if (option === 3) {
              console.log("Does it equal delegate");
              $("#delegateTable #delegateTbody").append(rowElement);
            } else if (option === 4) {
              console.log("Does it equal eliminate");
              $("#eliminateTable #eliminateTbody").append(rowElement);
            }
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
			refreshTasks();
		})
		.catch(function (error) {
			alert("Error on delete", error);
		});
}

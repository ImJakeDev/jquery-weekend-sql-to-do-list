$(document).ready(readyNow);

function readyNow() {
    console.log('Testing testing 1 2 3...');
    $('#sumbitTask').click(saveTasks);
    $(".table").on("click", ".deleteButton", deleteTask);
    refreshTasks();
}

function addTaskClickHandler() {
    // Inputs will need conditionals with levels that will automaticly make the value for matrix status 
    const taskName = $('#taskNameIn').val();
    const taskUrgenceLevel = $('#urgenceLevelIn').val();
    const taskImportanceLevel = $('#importanceLevelIn').val();
    const taskDetails = $('#taskDetailsIn').val();
}

function saveTasks() {
    console.log('In saveTasks function!');
	if (validateInputs()) {
		// checks if the inputs are infact invald, if so, return false.
		return false;
	}
	// ajax call to server to get tasks
	const taskName = $('#taskNameIn').val();
	const taskUrgenceLevel = $('#urgenceLevelIn').val();
	const taskImportanceLevel = $('#importanceLevelIn').val();
	const taskDetails = $('#taskDetailsIn').val();

	$.ajax({
		method: 'POST',
		url: '/tasks',
		data: {
			task_name: taskName,
			task_details: taskDetails,
			matrix_status: 'Do',
            urgence_level: taskUrgenceLevel,
            importance_level: taskImportanceLevel,
            progress_state: 'Inprogress',
		}
	}).then(function (response) {

		// update the history
		refreshTasks();
		clearInputs();
	}).catch(function (response) {
		// only called when server returns 4xx 5xx
		alert('something went wrong');
	})
}


function validateInputs() {
	if ($('#taskNameIn').val() === '' ||
		$('#urgenceLevelIn').val() === '' ||
		$('#importanceLevelIn').val() === '' ||
		$('#taskDetailsIn').val() === ''){
		alert('You must fill all input fields out!')
		return true;
	}
}

function clearInputs() {
	// function to clear the input fields
	$('#taskNameIn').val('');
	$('#urgenceLevelIn').val('');
	$('#importanceLevelIn').val('');
	$('#taskDetailsIn').val('');
}

// Function GETs data and displays it
function refreshTasks() {
    console.log('In refreshTask function!');
	$.ajax({
		method: 'GET',
		url: '/tasks',
	}).then(function (response) {
		$('#doTable #doTbody').empty();
		for (const task of response) {
            let rowElement = $('<tr class="table-success"></tr>');
            // Will need to think more about how and where to use these
			const name = task.task_name;
			const details = task.task_details;
			const matrixStatus = task.matrix_status;
			const urgence = task.urgence_level;
			const importance = task.importance_level;
            const progressState = task.progress_state;
            // What do I actually need to append in the table?
            rowElement.data('task', task);
            // Need to make this a variable that increments
            rowElement.append(`<th scope="row">1</th>`);
            //////////////////////////////////////////////
			rowElement.append(`<td>${name}</td>`);
			// rowElement.append(`<td>${details}</td>`);
            // rowElement.append(`<td>${progressState}</td>`);
            // If matrix status is 'Do' append here:
            // I could use this checkbox for my progress state...
			if (progressState === 'Complete') {
				let checkbox = $('<input type="checkbox" aria-label="Checkbox for following text input"/>').prop('checked', true).prop('disabled', true);
				let td = $('<td></td>').append(checkbox);
				rowElement.append(td);
				//$('#readyForTransferIn:checkbox:checked')
				//$('#' + id).is(":checked")
            }
            // If matrix status is 'Schedule' append here:
            // If matrix status is 'Delegate' append here:
            // If matrix status is 'Eliminate' append here:
            else {
				let checkbox = $('<input type="checkbox" class="readyToTransfer" aria-label="Checkbox for following text input"/>').prop('checked', false).prop('disabled', false);
				let td = $('<td></td>').append(checkbox);
				rowElement.append(td);
			}
			// rowElement.append(`<td>${notes}</td>`)
			// rowElement.append(
			// 	`<td><button class = "btn btn-danger deleteButton">Remove</button></td>`
            // );
            rowElement.append(
              `<td><button class = "btn btn-outline-danger deleteButton">X</button></td>`
            );
			$('#doTable #doTbody').append(rowElement);
		}
	})
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
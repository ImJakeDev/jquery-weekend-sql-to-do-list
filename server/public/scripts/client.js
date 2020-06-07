$(document).ready(readyNow);

function readyNow() {
    console.log('Testing testing 1 2 3...');
    $('#submitTask').click(addTaskClickHandler);
}

function addTaskClickHandler() {
    const taskName = $('#taskNameIn').val();
    const taskUrgenceLevel = $('#urgenceLevelIn').val();
    const taskImportanceLevel = $('#importanceLevelIn').val();
    const taskDetails = $('#taskDetailsIn').val();
}

function refreshTasks() {
	$.ajax({
		method: 'GET',
		url: '/tasks',
	}).then(function (response) {
		$('table tbody').empty();
		for (let task of response) {
			let rowElement = $("<tr></tr>");
			const name = koala.name;
			const sex = koala.sex;
			const age = koala.age;
			const readyToTransfer = koala.ready_to_transfer;
			const notes = koala.notes;

			rowElement.data('koala', koala);
			rowElement.append(`<td>${name}</td>`);
			rowElement.append(`<td>${sex}</td>`);
			rowElement.append(`<td>${age}</td>`);
			if (readyToTransfer === true) {
				let checkbox = $('<input type="checkbox"/>').prop('checked', true).prop('disabled', true);
				let td = $('<td></td>').append(checkbox);
				rowElement.append(td);
				//$('#readyForTransferIn:checkbox:checked')
				//$('#' + id).is(":checked")
			} else {
				let checkbox = $('<input type="checkbox" class="readyToTransfer"/>').prop('checked', false).prop('disabled', false);
				let td = $('<td></td>').append(checkbox);
				rowElement.append(td);
			}
			rowElement.append(`<td>${notes}</td>`)
			rowElement.append(
				`<td><button class = "btn btn-danger deleteButton">Remove</button></td>`
			);

			$('table tbody').append(rowElement);
		}
	})
}
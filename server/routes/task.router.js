const pool = require("../modules/pool.js");
const express = require("express");
const taskRouter = express.Router();

pool.on("connect", () => {
	console.log("Postgresql connected");
});

pool.on("error", (error) => {
	console.log("Error with postgres pool", error);
});

// GET

// GETs all the tasks from database
taskRouter.get("/", (req, res) => {
	pool
		.query('SELECT * FROM "tasks" ORDER BY "task_name";')
		.then((result) => {
			console.log(`Here is everything in /tasks`);
			res.status(200).send(result.rows);
		})
		.catch((err) =>
			res.status(500).send(`Error Connecting to Database: ${err}`)
		);
});

// I need a GET that only gets the progress_status of Inprogress
taskRouter.get("/:progress", (req, res) => {
	let task = req.body; // task with updated content
	let progress = req.params.progress; // id of the task to update
	console.log(task);
	let queryText = 'SELECT * FROM "tasks" WHERE "progress_state" = $1 ORDER BY "task_name"';
	pool
		.query(queryText, [progress])
		.then((result) => {
			console.log(`Here are task that are in progress`);
			res.status(200).send(result.rows);
		})
		.catch((err) =>
			res.status(500).send(`Error Connecting to Database: ${err}`)
		);
});

// I need a GET that only gets the matrix status
taskRouter.get("/status/:matrix", (req, res) => {
	let task = req.body; // task with updated content
	let matrix = req.params.matrix; // matrix of the task to update
	console.log(matrix);
	console.log('Here is the matrix status body:', task);
	let queryText =
		'SELECT * FROM "tasks" WHERE "matrix_status" = $1 ORDER BY "task_name"';
	pool
		.query(queryText, [matrix])
		.then((result) => {
			console.log('Here are tasks that are in progress from the', matrix);
			res.status(200).send(result.rows);
		})
		.catch((err) =>
			res.status(500).send(`Error Connecting to Database: ${err}`)
		);
});

// POST

// POSTs new task into database
taskRouter.post("/", (req, res) => {
	// get the task object
	const newTask = req.body;
	console.log(req.body);

	if (newTask.matrix_status === '') {
		res.sendStatus(400);
		return;
	}
	// typecast the ready_to_transfer string into boolean. must be "==" to work!
	// newTask.ready_to_transfer = newTask.ready_to_transfer;
	// console.log(newTask.ready_to_transfer);

	const queryText = 'INSERT INTO "tasks" (task_name, task_details, matrix_status, due_date, schedule_date, urgence_level, importance_level, progress_state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
	pool.query(queryText, [
			newTask.task_name,
			newTask.task_details,
			newTask.matrix_status,
			newTask.due_date,
			newTask.schedule_date,
			newTask.urgence_level,
			newTask.importance_level,
			newTask.progress_state,
		])
		.then((result) => {
			console.log('finished posting!');
			res.status(201);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(500);
		});
});

// PUT

// Request must include a parameter indicating what task to update - the id
// Request body must include the content to update - the status
taskRouter.put("/:id", (req, res) => {
	let task = req.body; // koala with updated content
	let id = req.params.id; // id of the koala to update

	console.log(task);
	let queryTextForUpdate = `UPDATE "tasks" SET "progress_state" = 'Complete' WHERE id = $1;`;
	pool
		.query(queryTextForUpdate, [id])
		.then((result) => {
			console.log(result.command);
			res.status(200).send(result);
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(500);
		});
});

// DELETE

// DELETEs a task from the DB
// Request must include a parameter indicating what book to update - the id
taskRouter.delete("/:id", (req, res) => {
	//let testArray = [req.params]
	let id = req.params.id; // id of the thing to delete
	console.log("Delete route called with id of", id);
	// let queryTextForSelect = `SELECT * FROM "books" WHERE "id" = $1;`
	let queryTextForDelete = `DELETE FROM "tasks" WHERE "id" = $1;`;
	// TODO - REPLACE BELOW WITH YOUR CODE
	pool
		.query(queryTextForDelete, [id])
		.then((result) => {
			console.log(result);
			res.status(200).send(result.rows);
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(500);
		});
});

module.exports = taskRouter;

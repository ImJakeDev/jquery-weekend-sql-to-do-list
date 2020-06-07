const pool = require('../modules/pool.js')
const express = require('express');
const taskRouter = express.Router();

pool.on('connect', () => {
	console.log('Postgresql connected');
});

pool.on('error', (error) => {
	console.log('Error with postgres pool', error)
});

// GET

// GETs all the tasks from database
taskRouter.get('/', (req, res) => {
    pool.query('SELECT * FROM "tasks" ORDER BY "task_name";')
        .then((result) => {
            console.log(`Here is everything in /tasks`);
            res.status(200).send(result.rows);
        })
        .catch((err) => res.status(500).send(`Error Connecting to Database: ${err}`));
});

// POST

// POSTs new task into database
taskRouter.post('/', (req, res) => {
	// get the task object
	const newTask = req.body;
	console.log(req.body);
	// typecast the ready_to_transfer string into boolean. must be "==" to work!
	// newTask.ready_to_transfer = newTask.ready_to_transfer;
	// console.log(newTask.ready_to_transfer);

	const queryText = `INSERT INTO "tasks" (task_name, task_details, matrix_status, due_date, schedule_date, urgence_level, importance_level, progress_state) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
	pool.query(queryText, [newTask.task_name, newTask.task_details, newTask.matrix_status, newTask.due_date, newTask.schedule_date, newTask.urgence_level, newTask.importance_level, newTask.progress_state])
		.then((result) => {
			res.status(201).send(`${newTask} was added to the database!`);
		})
		.catch((err) => {
			console.log(`Error making query ${queryText}`, err);
			res.sendStatus(500);
		});
});

// PUT

// DELETE

// DELETEs a task from the DB
// Request must include a parameter indicating what book to update - the id
taskRouter.delete('/:id', (req, res) => {
	//let testArray = [req.params]
	let id = req.params.id; // id of the thing to delete
	console.log('Delete route called with id of', id);
	// let queryTextForSelect = `SELECT * FROM "books" WHERE "id" = $1;`
	let queryTextForDelete = `DELETE FROM "tasks" WHERE "id" = $1;`
	// TODO - REPLACE BELOW WITH YOUR CODE
	pool.query(queryTextForDelete, [id])
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
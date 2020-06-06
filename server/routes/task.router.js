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

// PUT

// DELETE

module.exports = taskRouter;
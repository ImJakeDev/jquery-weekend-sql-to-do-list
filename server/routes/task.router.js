const pool = require('../modules/pool.js')
const express = require('express');
const taskRouter = express.Router();

pool.on('connect', () => {
	console.log('Postgresql connected');
});

pool.on('error', (error) => {
	console.log('Error with postgres pool', error)
});

module.exports = taskRouter;
/*
To set up the server database run the following queries in the database. 
enter the database after creating it before running additional commands
*/

CREATE DATABASE "weekend-to-do-app";

/* enter the database before continuing */

CREATE TABLE "tasks" (
	"id" 				INT GENERATED ALWAYS AS IDENTITY, /* Always a unique identifier */
	"task_name" 		VARCHAR(100) NOT NULL, /* A short task discription */
	"task_details"	    TEXT, /* If needed more information is stroed here */
	"matrix_status"		VARCHAR(11) NOT NULL, /* 4 options to choose where task is displayed in the matrix */
	"due_date"	        DATE, /* Option for a due date */
    "schedule_date"     DATE, /* Option for a scheduling a date */
	"urgence_level"		VARCHAR(11) NOT NULL, /* Level of urgence */
    "importance_level"  VARCHAR(14) NOT NULL, /* Level of importance */
    "progress_state"    VARCHAR(14) NOT NULL); /* State of progress */
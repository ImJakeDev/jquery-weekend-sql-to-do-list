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
	"matrix_status"		VARCHAR(11) NOT NULL, /* 4 options (Do, Schedule, Delegate, Eliminate) to choose where task is displayed in the matrix */
	"due_date"	        DATE, /* Option for a due date */
    "schedule_date"     DATE, /* Option for a scheduling a date */
	"urgence_level"		VARCHAR(10) NOT NULL, /* Level of urgence options: Urgent or Non-urgent */
    "importance_level"  VARCHAR(13) NOT NULL, /* Level of importance options: Important or Non-important */
    "progress_state"    VARCHAR(14) NOT NULL); /* State of progress options: Inprogress, Complete, Eliminate, Delete */
    /* Default is Inprogress.
    When check box is clicked it is Complete and will "disappear" from DOM. 
    When it is Non-urgent and Non-important it will have the state of Eliminate and is recommended to delete.
    Delete state means it is deleted??? */

/* Data example: */
INSERT INTO "tasks" ("task_name", "task_details", "matrix_status", "due_date", "urgence_level", "importance_level", "progress_state")
	VALUES ('Finish weekend assignment', 'This is something that needs to be done.', 'Do', 06/08/2020, 'Urgent', 'Important', 'Inprogress');
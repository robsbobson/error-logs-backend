# Description

Module used to read key data required during application startup.

## Information Files

<backend_concept>Planned project structure in the file from the path `./.ai/01_backend_concept.md</backend_concept>
Confirm that you have successfully read the content with the description <backend_concept>.

<db_file>Database file, path to the file `./app.sqlite</db_file>

## Definition of the Initialization Process

<init_process_steps>
    <init_app_db>Check if the database exists</init_app_db>
<init_process_steps>

## Step <init_app_db>

- Check if the database file <db_file> exists, if it does not exist, create a new database in the file <db_file>.
- Check if the table `startup_log` exists in the database, if it does not exist, create such a table with the columns: `start_datetime`, `start_duration`, `status`, `status_message`, `process_log`.

## Next Steps as the Application Develops

- It should be possible to add a step to the process <init_process_steps> by other modules that will be added as the application develops.
- The first step should always be the step <init_app_db>.
- After completing all steps, a log should be saved in the `startup_log` table.

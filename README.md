# Never Skip Leg Day

Personal project for keeping track of my workouts. The user will have the ability to register a user, log in and create workouts for each day of the week.

The project is almost entirely JavaScript as the backend was designed with the Express architecture in mind, while the frontend is React. The database I chose was postgres. The current state of the project can be found here https://neverskiplegday.ca. I chose AWS Elastic Beanstalk to host the backend and DB. The type of instance I chose was Docker. Therefore, the application has a docker file that is used by Elastic Beanstalk during time of deployment. The frontend is hosted on google firebase.

If one decides they want to set up my project, they will need:

- NPM (node package manager)

Once the repository is cloned, the developer will need to create a `.env` file in the root directory. They will need to add PG_HOST, PG_PASS, PG_NAME, PG_USER, PG_PORT and a SECRET variable to this file. I have a free postgres test DB set up with AWS RDS. Feel free to contact me if you want the hostname, user, password, port and secret for your `.env` file.

If you decide to set up the application to connect to your own database, feel free to do so. In the config folder, you can find an sql script that essentially creates the database tables and some initial records to get you started.

In order to start the application, run `npm install` in both the root directory, and the client directory. Then, in two separate terminals, run `npm start` in the client directory and also the root directory.

That should be it for now!

# Things that still need to be done:

  - Edit workout exercise reps, sets, and weight after creation
  - Upload avatar to user profile
  - Add timer to the current workout tab
  - Export workout history to CSV

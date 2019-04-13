# neverskiplegday

Personal project for keeping track of my workouts. The user will have the ability to register a user, log in and create workouts for each day of the week.

The project is almost entirely JavaScript as the backend designed with the Express architecture in mind, while the frontend is React. The database I chose was postgres. I plan to use docker when the time comes to building and deploying my website. I would also like to look into Google Firebase. Still need to hash those details out.

If one decides they want to set up my project, they will need:

- NPM (node package manager)
- postgres

Once postgres is installed, the developer will need to create a database for the project. The dbconfig can be found in the config folder in the root directory. Another thing to mention is the user will need to create their over private.key file which contains a secret that is used to sign JWT. Ideally, this will eventually use a private.key and public.key file. I have yet to look into it. However, for now the developer will need to create their own and place it in the root directory.

In order to start the application, enter `npm start-both` in a terminal while in the root directory.

That should be it for now!

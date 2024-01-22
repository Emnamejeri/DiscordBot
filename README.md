# DiscordBot
 
DiscordBot
Description This project involves creating a Discord bot integrated with a REST API that congratulates students on completing a sprint. The bot fetches a random celebration GIF, retrieves a congratulatory message template and sprint title from the database, and sends the message on a Discord server. The REST API supports various endpoints for managing messages, templates, and sprints.

Technologies Used Node.js Express.js SQLite JEST for testing ESLint + Prettier TypeScript

Instructions Clone the repository. Install dependencies: npm install. Start the server: npm start. Test the application: npm test.

Adding a Sprint
To add a sprint, use the following JSON format example and include the sprint details in your request in POSTMAN or Insomnia.

{ "sprintCode": "333", "sprintTitle": "query builders and ORM" }

Adding a Template
If you want to add a template, use the following JSON format and provide the template details.

{ "id": "444", "message": "Wooow amazing achievement" }

Adding a student achievement
To add a student achievement, submit a JSON request with the student's username and the corresponding sprint code.

{ "username": "emna", "sprintCode": "555" }

All details about the different API requests can be found in the routes file.

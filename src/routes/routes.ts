import express from 'express'
import messagesController from '../controllers/messagesController'
import templatesController from '../controllers/templatesControllers'
import sprintsController from '../controllers/sprintsController'

export function initializeRoutes(app: express.Application): void {
  //for the congratulatory messages
  //Handles the creation of a new message/achivment by the student
  app.post('/messages', messagesController.sendMessage)

  //retrieves all the messages sent to all students
  app.get('/messages', messagesController.getAllMessages)

  //retrieves all the messages sent to a specific student
  app.get('/messages/:username', messagesController.getMessagesByUser)

  //retrieves all the messages sent about a specific sprint
  app.get('/messages/sprint/:sprintCode', messagesController.getMessagesBySprint)

  //for the templates
  //Handles the creation of a new template
  app.post('/templates', templatesController.createTemplate)

  //Retrieves all templates from the database
  app.get('/templates', templatesController.getAllTemplates)

  //Retrieves a template by its ID from the database
  app.get('/templates/:id', templatesController.getTemplateById)

  //Updates a template by its ID with a new message
  app.patch('/templates/:id', templatesController.updateTemplate)

  //Delete a template by its ID from the database
  app.delete('/templates/:id', templatesController.deleteTemplate)

  //for the sprints
  //Handles the creation of a new sprint
  app.post('/sprints', sprintsController.createSprint)

  //retrieve all available sprints
  app.get('/sprints', sprintsController.getAllSprints)

  //retrieve sprint based on sprintcode
  app.get('/sprints/:sprintCode', sprintsController.getSprintByCode)

  //update the content of a sprint based on sprintcode
  app.patch('/sprints/:sprintCode', sprintsController.updateSprint)

  //delete all the sprints in the database
  app.delete('/sprints', sprintsController.deleteAllSprints)

  //delete a sprint based on the sprintcode
  app.delete('/sprints/:sprintCode', sprintsController.deleteSprintByCode)
}

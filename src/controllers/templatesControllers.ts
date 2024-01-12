import { Request, Response } from 'express'
import DatabaseService from '../services/databaseService'

const dbPromise = (DatabaseService as any).dbPromise

const templatesController = {
  createTemplate: async (req: Request, res: Response): Promise<void> => {
    try {
      const newTemplate = await DatabaseService.insertTemplate({ message: req.body.message, id: req.body.id })
      res.status(201).json({ id: newTemplate.id, message: req.body.message })
    } catch (error) {
      console.error('Error in db.gcreateTemplate:', error)
      res.status(500).json({ error: 'Internal Server Error related to creating a new template' })
    }
  },

  getAllTemplates: async (_req: Request, res: Response): Promise<void> => {
    try {
      const { templates } = await DatabaseService.getAllTemplates()
      res.status(200).json({ templates })
    } catch (error) {
      console.error('Error in db.getAllTemplates:', error)
      res.status(500).json({ error: 'Internal Server Error when retrieving all the templates' })
    }
  },

  getTemplateById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
      const template = await DatabaseService.getTemplateById(id)
      if (template) {
        res.status(200).json(template)
      } else {
        res.status(404).json({ error: 'Template not found' })
      }
    } catch (error) {
      console.error('Error in db.getTemplateById:', error)
      res.status(500).json({ error: 'Internal Server Error while retrieving this specific template' })
    }
  },

  updateTemplate: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { message } = req.body
    try {
      const success = await DatabaseService.updateTemplate(id, { message })
      if (success) {
        res.status(200).json({ id, message })
      } else {
        res.status(404).json({ error: 'Template not found' })
      }
    } catch (error) {
      console.error('Error in db.updateTemplate:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  deleteTemplate: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
      const success = await DatabaseService.deleteTemplate(id)
      if (success) {
        res.status(204).send({ message: 'Template deleted successfully' })
      } else {
        res.status(404).json({ error: 'Template not found' })
      }
    } catch (error) {
      console.error('Error in db.deleteTemplate:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },
}

export default templatesController

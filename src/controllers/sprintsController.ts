import { Request, Response } from 'express'
import DatabaseService from '../services/databaseService'

const db = DatabaseService

const sprintsController = {
  createSprint: async (req: Request, res: Response): Promise<void> => {
    try {
      const { sprintTitle, sprintCode } = req.body
      const newSprint = await db.insertSprint({ sprintTitle, sprintCode })

      if (newSprint && 'sprintTitle' in newSprint && 'sprintCode' in newSprint) {
        res.status(201).json({ sprintTitle: newSprint.sprintTitle, sprintCode: newSprint.sprintCode })
      } else {
        res.status(500).json({ error: 'Internal Server Error 1 while creating a new sprint' })
      }
    } catch (error) {
      console.error('Error in db.insertSprint:', error)
      res.status(500).json({ error: 'Internal Server Error 1 while creating a new sprint' })
    }
  },

  getAllSprints: async (_req: Request, res: Response): Promise<void> => {
    try {
      const { sprints } = await db.getAllSprints()
      res.status(200).json({ sprints })
    } catch (error) {
      console.error('Error in db.getAllSprints:', error)
      res.status(500).json({ error: 'Internal Server Error for the sprints' })
    }
  },

  getSprintByCode: async (req: Request, res: Response): Promise<void> => {
    const { sprintCode } = req.params

    try {
      const sprint = await db.getSprintByCode(sprintCode)

      if (sprint) {
        res.status(200).json(sprint)
      } else {
        res.status(404).json({ error: 'Sprint not found' })
      }
    } catch (error) {
      console.error('Error in db.getSprintByCode:', error)
      res.status(500).json({ error: 'Internal Server Error 2 related to retrieving' })
    }
  },

  deleteAllSprints: async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await db.deleteAllSprints()

      if (success) {
        res.status(200).json({ message: 'All sprints deleted successfully' })
      } else {
        res.status(404).json({ error: 'No sprints found to delete' })
      }
    } catch (error) {
      console.error('Error in db.dltAllSprints:', error)
      res.status(500).json({ error: 'Internal Server Error related to deleting sprints' })
    }
  },

  deleteSprintByCode: async (req: Request, res: Response): Promise<void> => {
    const { sprintCode } = req.params

    try {
      const success = await db.deleteSprintByCode(sprintCode)

      if (success) {
        res.status(200).json({ message: `Sprint with code ${sprintCode} deleted successfully` })
      } else {
        res.status(404).json({ error: `Sprint with code ${sprintCode} not found` })
      }
    } catch (error) {
      console.error('Error in db.dlt bySprintscode:', error)
      res.status(500).json({ error: `Internal Server Error related to deleting sprint with code ${sprintCode}` })
    }
  },

  updateSprint: async (req: Request, res: Response): Promise<void> => {
    const { sprintCode } = req.params
    const { sprintTitle, sprintCode: newSprintCode } = req.body

    try {
      const updatedSprint = await db.updateSprint(sprintCode, { sprintTitle, sprintCode: newSprintCode })

      if (updatedSprint) {
        res.status(200).json(updatedSprint)
      } else {
        res.status(404).json({ error: 'Sprint not found' })
      }
    } catch (error) {
      console.error('Error in db.updateasprint:', error)
      res.status(500).json({ error: 'Internal Server Error 3 related to updating the sprint' })
    }
  },
}

export default sprintsController

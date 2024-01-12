import { Request, Response } from 'express'
import sprintsController from '../src/controllers/sprintsController'
import { DatabaseService } from '../src/services/databaseService'

jest.mock('../src/services/databaseService')

describe('sprintsController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  describe('createSprint', () => {
    it('should create a new sprint and return 201 status with sprint details', async () => {
      const mockInsertSprint = jest.fn().mockResolvedValue({ sprintTitle: 'Test Sprint', sprintCode: 'TEST123' })
      DatabaseService.insertSprint = mockInsertSprint

      mockRequest.body = { sprintTitle: 'Test Sprint', sprintCode: 'TEST123' }

      await sprintsController.createSprint(mockRequest as Request, mockResponse as Response)

      expect(mockInsertSprint).toHaveBeenCalledWith({ sprintTitle: 'Test Sprint', sprintCode: 'TEST123' })
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith({ sprintTitle: 'Test Sprint', sprintCode: 'TEST123' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockInsertSprint = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.insertSprint = mockInsertSprint

      mockRequest.body = { sprintTitle: 'Test Sprint', sprintCode: 'TEST123' }

      await sprintsController.createSprint(mockRequest as Request, mockResponse as Response)

      expect(mockInsertSprint).toHaveBeenCalledWith({ sprintTitle: 'Test Sprint', sprintCode: 'TEST123' })
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error 1 while creating a new sprint' })
    })
  })

  describe('getAllSprints', () => {
    it('should get all sprints and return 200 status with sprint array', async () => {
      const mockGetAllSprints = jest
        .fn()
        .mockResolvedValue({ sprints: [{ sprintTitle: 'Sprint 1', sprintCode: 'SP1' }] })
      DatabaseService.getAllSprints = mockGetAllSprints

      await sprintsController.getAllSprints(mockRequest as Request, mockResponse as Response)

      expect(mockGetAllSprints).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ sprints: [{ sprintTitle: 'Sprint 1', sprintCode: 'SP1' }] })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockGetAllSprints = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.getAllSprints = mockGetAllSprints

      await sprintsController.getAllSprints(mockRequest as Request, mockResponse as Response)

      expect(mockGetAllSprints).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error for the sprints' })
    })
  })

  describe('getSprintByCode', () => {
    it('should get a sprint by code and return 200 status with sprint details', async () => {
      const mockGetSprintByCode = jest.fn().mockResolvedValue({ sprintTitle: 'Test Sprint', sprintCode: 'TEST123' })
      DatabaseService.getSprintByCode = mockGetSprintByCode

      mockRequest.params = { sprintCode: 'TEST123' }

      await sprintsController.getSprintByCode(mockRequest as Request, mockResponse as Response)

      expect(mockGetSprintByCode).toHaveBeenCalledWith('TEST123')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ sprintTitle: 'Test Sprint', sprintCode: 'TEST123' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockGetSprintByCode = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.getSprintByCode = mockGetSprintByCode

      mockRequest.params = { sprintCode: 'TEST123' }

      await sprintsController.getSprintByCode(mockRequest as Request, mockResponse as Response)

      expect(mockGetSprintByCode).toHaveBeenCalledWith('TEST123')
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error 2 related to retrieving' })
    })

    it('should handle not finding the sprint and return 404 status with an error message', async () => {
      const mockGetSprintByCode = jest.fn().mockResolvedValue(null)
      DatabaseService.getSprintByCode = mockGetSprintByCode

      mockRequest.params = { sprintCode: 'TEST123' }

      await sprintsController.getSprintByCode(mockRequest as Request, mockResponse as Response)

      expect(mockGetSprintByCode).toHaveBeenCalledWith('TEST123')
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Sprint not found' })
    })
  })

  describe('deleteAllSprints', () => {
    it('should delete all sprints and return 200 status with success message', async () => {
      const mockDeleteAllSprints = jest.fn().mockResolvedValue(true)
      DatabaseService.deleteAllSprints = mockDeleteAllSprints

      await sprintsController.deleteAllSprints(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteAllSprints).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'All sprints deleted successfully' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockDeleteAllSprints = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.deleteAllSprints = mockDeleteAllSprints

      await sprintsController.deleteAllSprints(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteAllSprints).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error related to deleting sprints' })
    })

    it('should handle no sprints found and return 404 status with an error message', async () => {
      const mockDeleteAllSprints = jest.fn().mockResolvedValue(false)
      DatabaseService.deleteAllSprints = mockDeleteAllSprints

      await sprintsController.deleteAllSprints(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteAllSprints).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No sprints found to delete' })
    })
  })

  describe('deleteSprintByCode', () => {
    it('should delete a sprint by code and return 200 status with success message', async () => {
      const mockDeleteSprintByCode = jest.fn().mockResolvedValue(true)
      DatabaseService.deleteSprintByCode = mockDeleteSprintByCode

      mockRequest.params = { sprintCode: 'TEST123' }

      await sprintsController.deleteSprintByCode(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteSprintByCode).toHaveBeenCalledWith('TEST123')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Sprint with code TEST123 deleted successfully' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockDeleteSprintByCode = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.deleteSprintByCode = mockDeleteSprintByCode

      mockRequest.params = { sprintCode: 'TEST123' }

      await sprintsController.deleteSprintByCode(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteSprintByCode).toHaveBeenCalledWith('TEST123')
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error related to deleting sprint with code TEST123',
      })
    })

    it('should handle not finding the sprint and return 404 status with an error message', async () => {
      const mockDeleteSprintByCode = jest.fn().mockResolvedValue(false)
      DatabaseService.deleteSprintByCode = mockDeleteSprintByCode

      mockRequest.params = { sprintCode: 'TEST123' }

      await sprintsController.deleteSprintByCode(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteSprintByCode).toHaveBeenCalledWith('TEST123')
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Sprint with code TEST123 not found' })
    })
  })

  describe('updateSprint', () => {
    it('should update a sprint and return 200 status with updated sprint details', async () => {
      const mockUpdateSprint = jest.fn().mockResolvedValue({ sprintTitle: 'Updated Sprint', sprintCode: 'TEST123' })
      DatabaseService.updateSprint = mockUpdateSprint

      mockRequest.params = { sprintCode: 'TEST123' }
      mockRequest.body = { sprintTitle: 'Updated Sprint', sprintCode: 'NEWCODE' }

      await sprintsController.updateSprint(mockRequest as Request, mockResponse as Response)

      expect(mockUpdateSprint).toHaveBeenCalledWith('TEST123', { sprintTitle: 'Updated Sprint', sprintCode: 'NEWCODE' })
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ sprintTitle: 'Updated Sprint', sprintCode: 'TEST123' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockUpdateSprint = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.updateSprint = mockUpdateSprint

      mockRequest.params = { sprintCode: 'TEST123' }
      mockRequest.body = { sprintTitle: 'Updated Sprint', sprintCode: 'NEWCODE' }

      await sprintsController.updateSprint(mockRequest as Request, mockResponse as Response)

      expect(mockUpdateSprint).toHaveBeenCalledWith('TEST123', { sprintTitle: 'Updated Sprint', sprintCode: 'NEWCODE' })
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error 3 related to updating the sprint',
      })
    })

    it('should handle not finding the sprint and return 404 status with an error message', async () => {
      const mockUpdateSprint = jest.fn().mockResolvedValue(false)
      DatabaseService.updateSprint = mockUpdateSprint

      mockRequest.params = { sprintCode: 'TEST123' }
      mockRequest.body = { sprintTitle: 'Updated Sprint', sprintCode: 'NEWCODE' }

      await sprintsController.updateSprint(mockRequest as Request, mockResponse as Response)

      expect(mockUpdateSprint).toHaveBeenCalledWith('TEST123', { sprintTitle: 'Updated Sprint', sprintCode: 'NEWCODE' })
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Sprint not found' })
    })
  })
})

import { Request, Response } from 'express'
import templatesController from '../src/controllers/templatesControllers'
import { DatabaseService } from '../src/services/databaseService'

jest.mock('../src/services/databaseService')

describe('templatesController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    }
  })

  describe('createTemplate', () => {
    it('should create a new template msg and return 201 status with template details', async () => {
      const mockInsertTemplate = jest.fn().mockResolvedValue({ id: '1', message: 'Test Template' })
      DatabaseService.insertTemplate = mockInsertTemplate

      mockRequest.body = { message: 'Test Template', id: '1' }

      await templatesController.createTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockInsertTemplate).toHaveBeenCalledWith({ message: 'Test Template', id: '1' })
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith({ id: '1', message: 'Test Template' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockInsertTemplate = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.insertTemplate = mockInsertTemplate

      mockRequest.body = { message: 'Test Template', id: '1' }

      await templatesController.createTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockInsertTemplate).toHaveBeenCalledWith({ message: 'Test Template', id: '1' })
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error related to creating a new template',
      })
    })
  })

  describe('getAllTemplates', () => {
    it('should get all templates and return 200 status with template array', async () => {
      const mockGetAllTemplates = jest.fn().mockResolvedValue({ templates: [{ id: '1', message: 'Template 1' }] })
      DatabaseService.getAllTemplates = mockGetAllTemplates

      await templatesController.getAllTemplates(mockRequest as Request, mockResponse as Response)

      expect(mockGetAllTemplates).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ templates: [{ id: '1', message: 'Template 1' }] })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockGetAllTemplates = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.getAllTemplates = mockGetAllTemplates

      await templatesController.getAllTemplates(mockRequest as Request, mockResponse as Response)

      expect(mockGetAllTemplates).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error when retrieving all the templates',
      })
    })
  })

  describe('getTemplateById', () => {
    it('should get a template by id and return 200 status with template details', async () => {
      const mockGetTemplateById = jest.fn().mockResolvedValue({ id: '1', message: 'Test Template' })
      DatabaseService.getTemplateById = mockGetTemplateById

      mockRequest.params = { id: '1' }

      await templatesController.getTemplateById(mockRequest as Request, mockResponse as Response)

      expect(mockGetTemplateById).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ id: '1', message: 'Test Template' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockGetTemplateById = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.getTemplateById = mockGetTemplateById

      mockRequest.params = { id: '1' }

      await templatesController.getTemplateById(mockRequest as Request, mockResponse as Response)

      expect(mockGetTemplateById).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error while retrieving this specific template',
      })
    })

    it('should handle not finding the template and return 404 status with an error message', async () => {
      const mockGetTemplateById = jest.fn().mockResolvedValue(null)
      DatabaseService.getTemplateById = mockGetTemplateById

      mockRequest.params = { id: '1' }

      await templatesController.getTemplateById(mockRequest as Request, mockResponse as Response)

      expect(mockGetTemplateById).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Template not found' })
    })
  })

  describe('updateTemplate', () => {
    it('should update a template and return 200 status with updated template details', async () => {
      const mockUpdateTemplate = jest.fn().mockResolvedValue({ id: '1', message: 'Updated Template' })
      DatabaseService.updateTemplate = mockUpdateTemplate

      mockRequest.params = { id: '1' }
      mockRequest.body = { message: 'Updated Template' }

      await templatesController.updateTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockUpdateTemplate).toHaveBeenCalledWith('1', { message: 'Updated Template' })
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ id: '1', message: 'Updated Template' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockUpdateTemplate = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.updateTemplate = mockUpdateTemplate

      mockRequest.params = { id: '1' }
      mockRequest.body = { message: 'Updated Template' }

      await templatesController.updateTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockUpdateTemplate).toHaveBeenCalledWith('1', { message: 'Updated Template' })
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
    })

    it('should handle not finding the template and return 404 status with an error message', async () => {
      const mockUpdateTemplate = jest.fn().mockResolvedValue(false)
      DatabaseService.updateTemplate = mockUpdateTemplate

      mockRequest.params = { id: '1' }
      mockRequest.body = { message: 'Updated Template' }

      await templatesController.updateTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockUpdateTemplate).toHaveBeenCalledWith('1', { message: 'Updated Template' })
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Template not found' })
    })
  })

  describe('deleteTemplate', () => {
    it('should delete a template and return 204 status with success message', async () => {
      const mockDeleteTemplate = jest.fn().mockResolvedValue(true)
      DatabaseService.deleteTemplate = mockDeleteTemplate

      mockRequest.params = { id: '1' }

      await templatesController.deleteTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteTemplate).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(204)
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Template deleted successfully' })
    })

    it('should handle errors and return 500 status with an error message', async () => {
      const mockDeleteTemplate = jest.fn().mockRejectedValue(new Error('Database error'))
      DatabaseService.deleteTemplate = mockDeleteTemplate

      mockRequest.params = { id: '1' }

      await templatesController.deleteTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteTemplate).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
    })

    it('should handle not finding the template and return 404 status with an error message', async () => {
      const mockDeleteTemplate = jest.fn().mockResolvedValue(false)
      DatabaseService.deleteTemplate = mockDeleteTemplate

      mockRequest.params = { id: '1' }

      await templatesController.deleteTemplate(mockRequest as Request, mockResponse as Response)

      expect(mockDeleteTemplate).toHaveBeenCalledWith('1')
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Template not found' })
    })
  })
})

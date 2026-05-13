import { Request, Response } from 'express'
import { ProjectService } from './projects.service'
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../../../utils/response'
import type { ProjectQuery, CreateProjectDto, UpdateProjectDto } from './projects.schema'

export async function getProjects(req: Request, res: Response): Promise<void> {
  const isAdmin = req.auth?.role === 'admin'
  const { data, meta } = await ProjectService.findAll(req.query as unknown as ProjectQuery, isAdmin)
  sendPaginated(res, data, meta)
}
export async function getProject(req: Request, res: Response): Promise<void> {
  const project = await ProjectService.findById(req.params.id)
  ProjectService.incrementView(req.params.id).catch(() => undefined)
  sendSuccess(res, project)
}
export async function getMyProjects(req: Request, res: Response): Promise<void> {
  const { data, meta } = await ProjectService.findByAuthor(req.auth!.userId, req.query as unknown as ProjectQuery)
  sendPaginated(res, data, meta)
}
export async function createProject(req: Request, res: Response): Promise<void> {
  const project = await ProjectService.create(req.body as CreateProjectDto, req.auth!.userId)
  sendCreated(res, project)
}
export async function updateProject(req: Request, res: Response): Promise<void> {
  const isAdmin = req.auth?.role === 'admin'
  const project = await ProjectService.update(req.params.id, req.body as UpdateProjectDto, req.auth!.userId, isAdmin)
  sendSuccess(res, project)
}
export async function deleteProject(req: Request, res: Response): Promise<void> {
  await ProjectService.delete(req.params.id, req.auth!.userId, req.auth!.role)
  sendNoContent(res)
}
export async function uploadProjectFile(req: Request, res: Response): Promise<void> {
  if (!req.file) throw new Error('No file attached to request')
  const result = await ProjectService.uploadFile(req.params.id, req.file, req.auth!.userId)
  sendSuccess(res, { ...result, message: 'File uploaded and queued for processing' }, 202)
}

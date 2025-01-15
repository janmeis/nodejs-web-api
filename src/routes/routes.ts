import { Express } from 'express';
import { SynoApiController } from '../controllers/synoApiController';

export const setRoutes = (app: Express) => {
  /**
   * @swagger
   * /syno/info:
   *   get:
   *     summary: Get Syno API Info
   *     responses:
   *       200:
   *         description: Syno API Info
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Syno API Info
   */
  app.get('/syno/info', SynoApiController.info);

  /**
   * @swagger
   * /syno/auth:
   *   get:
   *     summary: Authenticate with Syno API
   *     responses:
   *       200:
   *         description: Authentication response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Authentication successful
   */
  app.get('/syno/auth', SynoApiController.auth);

  /**
   * @swagger
   * /syno/folder:
   *   get:
   *     summary: Get folder information
   *     parameters:
   *       - in: query
   *         name: dirId
   *         schema:
   *           type: string
   *         description: The ID of the directory to list
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           default: name
   *         description: The field to sort by
   *       - in: query
   *         name: sortDirection
   *         schema:
   *           type: string
   *           default: asc
   *         description: The direction to sort (asc or desc)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20000
   *         description: The maximum number of items to return
   *     responses:
   *       200:
   *         description: Folder information
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   title:
   *                     type: string
   */
  app.get('/syno/folder', SynoApiController.folder);
};
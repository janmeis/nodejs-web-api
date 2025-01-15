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
   *     responses:
   *       200:
   *         description: Folder information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Folder information
   */
  app.get('/syno/folder', SynoApiController.folder);
};
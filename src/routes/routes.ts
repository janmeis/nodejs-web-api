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
   *           default: title
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
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: The offset of the first item
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

  /**
   * @swagger
   * /syno/artist:
   *   get:
   *     summary: Get artist information
   *     parameters:
   *       - in: query
   *         name: filter
   *         schema:
   *           type: string
   *         description: Filter for the artist list
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
   *         description: Artist information
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   */
  app.get('/syno/artist', SynoApiController.artist);

  /**
   * @swagger
   * /syno/album:
   *   get:
   *     summary: Get album information
   *     parameters:
   *       - in: query
   *         name: filter
   *         schema:
   *           type: string
   *         description: Filter for the album list
   *       - in: query
   *         name: artist
   *         schema:
   *           type: string
   *           default: Andrew Hill
   *         description: The artist to list albums for
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           default: year
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
   *         description: Album information
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
  app.get('/syno/album', SynoApiController.album);

  /**
   * @swagger
   * /syno/song:
   *   get:
   *     summary: Get song information
   *     parameters:
   *       - in: query
   *         name: artist
   *         schema:
   *           type: string
   *         description: The artist of the songs to list
   *       - in: query
   *         name: album
   *         schema:
   *           type: string
   *         description: The album of the songs to list
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           default: year
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
   *         description: Song information
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
   *                   artist:
   *                     type: string
   *                   album:
   *                     type: string
   *                   year:
   *                     type: integer
   *                   genre:
   *                     type: string
   *                   duration:
   *                     type: integer
   *                   filesize:
   *                     type: integer
   */
  app.get('/syno/song', SynoApiController.song);
};

import { Express } from 'express';
import {
  info,
  auth,
  folder,
  artist,
  album,
  song,
  updateplaylist,
  getplaylist,
  control,
} from '../controllers/synoApiController';

export const setRoutes = (app: Express) => {
  /**
   * @swagger
   * /:
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
  app.get('/', info);

  /**
   * @swagger
   * /auth:
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
  app.get('/auth', auth);

  /**
   * @swagger
   * /folder:
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
  app.get('/folder', folder);

  /**
   * @swagger
   * /artist:
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
  app.get('/artist', artist);

  /**
   * @swagger
   * /album:
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
  app.get('/album', album);

  /**
   * @swagger
   * /song:
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
  app.get('/song', song);

  /**
   * @swagger
   * /updateplaylist:
   *   get:
   *     summary: Play folder content
   *     parameters:
   *       - in: query
   *         name: dirId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the directory to play
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: The maximum number of items to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: The offset of the first item
   *     responses:
   *       200:
   *         description: Playback started
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   */
  app.get('/updateplaylist', updateplaylist);

  /**
   * @swagger
   * /getplaylist:
   *   get:
   *     summary: Get current playlist
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: The maximum number of items to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: The offset of the first item
   *     responses:
   *       200:
   *         description: Current playlist information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     songs:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                           title:
   *                             type: string
   *                           artist:
   *                             type: string
   *                           album:
   *                             type: string
   */
  app.get('/getplaylist', getplaylist);

  /**
   * @swagger
   * /control:
   *   get:
   *     summary: Control player playback
   *     tags: [Player Control]
   *     parameters:
   *       - in: query
   *         name: action
   *         schema:
   *           type: string
   *           enum: [play, pause, stop, next, previous]
   *           default: play
   *         description: The control action to perform
   *     responses:
   *       200:
   *         description: Control action performed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   */
  app.get('/control', control);
};

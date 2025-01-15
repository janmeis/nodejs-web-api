import { Request, Response } from 'express';
import axios from 'axios';
import config from 'config';
import { formatDuration } from '../utils';
import { IFolder } from '../model/folder';

export class SynoApiController {
  private static readonly baseUrl = config.get<string>('synoUrl.base');
  private static sid = '';

  public static async info(_: Request, res: Response): Promise<void> {
    try {
      const url = `${SynoApiController.baseUrl}/query.cgi?api=SYNO.API.Info&version=1&method=query`;
      console.log(url);

      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async auth(_: Request, res: Response): Promise<void> {
    try {
      const account = config.get<string>('synoUrl.account');
      const encodedPassword = config.get<string>('synoUrl.passwd');

      // Decode the Base64-encoded password
      const password = Buffer.from(encodedPassword, 'base64').toString('utf-8');

      const url = `${SynoApiController.baseUrl}/auth.cgi?api=SYNO.API.Auth&version=7&method=login&account=${account}&passwd=${password}&format=sid`;
      console.log(url);

      const response = await axios.get(url);
      SynoApiController.sid = response.data.data.sid;
      res.json(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async folder(req: Request, res: Response): Promise<void> {
    try {
      const dirId = req.query.dirId || null;
      const sortBy = req.query.sortBy || 'title';
      const sortDirection = req.query.sortDirection || 'asc';
      const limit = req.query.limit || config.get<string>('synoUrl.limit');
      const offset = req.query.offset || 0;

      let url = `${SynoApiController.baseUrl}/AudioStation/folder.cgi?api=SYNO.AudioStation.Folder&version=3&method=list`
        + `&_sid=${SynoApiController.sid}`
        + `&limit=${limit}`
        + `&offset=${offset}`
        + `&sort_by=${sortBy}`
        + `&sort_direction=${sortDirection}`
        + `&additional=${encodeURIComponent('song_tag,song_audio,song_rating')}`;

      if (dirId)
        url += `&id=${dirId}`;
      console.log(url);

      const response = await axios.get(url);
      const folders = (response.data.data.items as any[]).map((item) => {
        let folder: IFolder = { id: item.id, title: item.title };
        if (item.additional && item.additional.song_audio && item.additional.song_tag) {
          const song = SynoApiController.populateSong(item.additional);
          folder = { ...folder, ...song };
        }
        return folder;
      });
      res.json(folders);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async artist(req: Request, res: Response): Promise<void> {
    try {
      const sortBy = req.query.sortBy || 'name';
      const sortDirection = req.query.sortDirection || 'asc';
      const limit = req.query.limit || config.get<string>('synoUrl.limit');
      const offset = req.query.offset || 0;
      const filter = req.query.filter || null;
     
      let url = `${SynoApiController.baseUrl}/AudioStation/artist.cgi?api=SYNO.AudioStation.Artist&version=4&method=list`
        + `&_sid=${SynoApiController.sid}`
        + `&limit=${limit}`
        + `&offset=${offset}`
        + `&sort_by=${sortBy}`
        + `&sort_direction=${sortDirection}`

      if (filter)
        url += `&filter=${encodeURIComponent(`${filter}`)}`;
      console.log(url);

      const response = await axios.get(url);
      const artists = (response.data.data.artists as any[]).map((item) => item.name);
      res.json(artists);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async album(req: Request, res: Response): Promise<void> {
    try {
      const artist = req.query.artist || '';
      const sortBy = req.query.sortBy || 'year';
      const sortDirection = req.query.sortDirection || 'asc';
      const limit = req.query.limit || config.get<string>('synoUrl.limit');
      const offset = req.query.offset || 0;
      const filter = req.query.filter || null;
     
      let url = `${SynoApiController.baseUrl}/AudioStation/album.cgi?api=SYNO.AudioStation.Album&version=3&method=list`
        + `&_sid=${SynoApiController.sid}`
        + `&limit=${limit}`
        + `&offset=${offset}`
        + `&sort_by=${sortBy}`
        + `&sort_direction=${sortDirection}`;

      if (artist)
        url += `&artist=${encodeURIComponent(`${artist}`)}`;
      if (filter)
        url += `&filter=${encodeURIComponent(`${filter}`)}`;
      console.log(url);

      const response = await axios.get(url);
      const albums = (response.data.data.albums as any[]).map((item) => `${item.display_artist}, ${item.name}, ${item.year}`);
      res.json(albums);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async song(req: Request, res: Response): Promise<void> {
    try {
      const artist = req.query.artist || '';
      const album = req.query.album || '';
      const sortBy = req.query.sortBy || 'year';
      const sortDirection = req.query.sortDirection || 'asc';
      const limit = req.query.limit || config.get<string>('synoUrl.limit');
      const offset = req.query.offset || 0;
      const filter = req.query.filter || null;
     
      let url = `${SynoApiController.baseUrl}/AudioStation/song.cgi?api=SYNO.AudioStation.Song&version=3&method=list`
        + `&_sid=${SynoApiController.sid}`
        + `&limit=${limit}`
        + `&offset=${offset}`
        + `&sort_by=${sortBy}`
        + `&sort_direction=${sortDirection}`
        + `&additional=${encodeURIComponent('song_tag,song_audio,song_rating')}`;

      if (artist)
        url += `&artist=${encodeURIComponent(`${artist}`)}`;
      if (album)
        url += `&album=${encodeURIComponent(`${album}`)}`;
      if (filter)
        url += `&filter=${encodeURIComponent(`${filter}`)}`;
      console.log(url);

      const response = await axios.get(url);
      const songs = (response.data.data.songs as any[]).map((item) => {
        let folder: IFolder = { id: item.id, title: item.title };
        if (item.additional && item.additional.song_audio && item.additional.song_tag) {
          const song = SynoApiController.populateSong(item.additional);
          folder = { ...folder, ...song };
        }
        return folder;
      });
      res.json(songs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  private static populateSong(additional: any): any {
    return {
      time: +additional.song_audio.duration,
      timeString: formatDuration(+additional.song_audio.duration),
      filesize: +additional.song_audio.filesize,
      filesizeString: `${(additional.song_audio.filesize / 1024 / 1024).toFixed(2)} MB`,
      disc: +additional.song_tag.disc,
      track: +additional.song_tag.track,
      genre: additional.song_tag.genre,
    };
  }
}
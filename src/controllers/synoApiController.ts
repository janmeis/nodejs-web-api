import axios from 'axios';
import { Request, Response } from 'express';
import { IFolder } from '../model/folder';
import { formatDuration } from '../utils';
import 'dotenv/config';
import { dir } from 'console';

const baseUrl = process.env.SYNO_URL || 'http://localhost:5000';
let sid = '';

axios.interceptors.request.use((config) => {
  config.headers = {
    'Content-Type': 'application/json',
    // eslint-disable-next-line prettier/prettier
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'axios/1.x',
    'Access-Control-Allow-Origin': '*',
  } as any;
  config.timeout = 10000; // Wait for 10 seconds before timing out
  return config;
});

export const info = async (_: Request, res: Response): Promise<void> => {
  try {
    const url = `${baseUrl}/query.cgi?api=SYNO.API.Info&version=1&method=query`;
    console.log(url);

    const response = await axios.get(url);
    console.log(response.data);
    res.json(response.data.data);
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const auth = async (_: Request, res: Response): Promise<void> => {
  try {
    const account = process.env.SYNO_ACCOUNT || 'admin';
    const encodedPassword = process.env.SYNO_PASSWORD || '';

    // Decode the Base64-encoded password
    const password = Buffer.from(encodedPassword, 'base64').toString('utf-8');

    const url = `${baseUrl}/auth.cgi?api=SYNO.API.Auth&version=7&method=login&account=${account}&passwd=${password}&format=sid`;

    const response = await axios.get(url);
    sid = response.data.data.sid;
    res.json(response.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const folder = async (req: Request, res: Response): Promise<void> => {
  try {
    const dirId = req.query.dirId || null;
    const sortBy = req.query.sortBy || 'title';
    const sortDirection = req.query.sortDirection || 'asc';
    const limit = req.query.limit || process.env.SYNO_LIMIT || '100';
    const offset = req.query.offset || 0;

    let url =
      `${baseUrl}/AudioStation/folder.cgi?api=SYNO.AudioStation.Folder&version=3&method=list` +
      `&_sid=${sid}` +
      `&limit=${limit}` +
      `&offset=${offset}` +
      `&sort_by=${sortBy}` +
      `&sort_direction=${sortDirection}` +
      `&additional=song_tag,song_audio,song_rating`;

    if (dirId) url += `&id=${dirId}`;

    const response = await axios.get(url);
    const folders = (response.data.data.items as any[]).map((item) => {
      let folder: IFolder = { id: item.id, title: item.title };
      if (
        item.additional &&
        item.additional.song_audio &&
        item.additional.song_tag
      ) {
        const song = populateSong(item.additional);
        folder = { ...folder, ...song };
      }
      return folder;
    });

    let cover = '';
    if (dirId && folders.length > 0) {
      if (folders[0].album) {
        cover = getCover(folders[0].artist, folders[0].album);
      } else {
        const randomIndex = Math.floor(Math.random() * folders.length);
        const randomFolder = folders[randomIndex];
        const coverUrl = url.replace(/id=([\d\w_]+)$/, `id=${randomFolder.id}`);
        const coverResponse = await axios.get(coverUrl);
        const songTag = coverResponse.data.data.items[0].additional.song_tag;
        cover = getCover(songTag.artist, songTag.album);
      }
    }
    res.json({
      cover,
      total: response.data.data.total,
      folders: folders,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const artist = async (req: Request, res: Response): Promise<void> => {
  try {
    const sortBy = req.query.sortBy || 'name';
    const sortDirection = req.query.sortDirection || 'asc';
    const limit = req.query.limit || process.env.SYNO_LIMIT || '100';
    const offset = req.query.offset || 0;
    const filter = req.query.filter || null;

    let url =
      `${baseUrl}/AudioStation/artist.cgi?api=SYNO.AudioStation.Artist&version=4&method=list` +
      `&_sid=${sid}` +
      `&limit=${limit}` +
      `&offset=${offset}` +
      `&sort_by=${sortBy}` +
      `&sort_direction=${sortDirection}`;

    if (filter) url += `&filter=${filter}`;

    const response = await axios.get(url);
    const artists = (response.data.data.artists as any[]).map((item) => ({
      name: item.name,
    }));
    res.json(artists);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const album = async (req: Request, res: Response): Promise<void> => {
  try {
    const artist = req.query.artist || '';
    const sortBy = req.query.sortBy || 'year';
    const sortDirection = req.query.sortDirection || 'asc';
    const limit = req.query.limit || process.env.SYNO_LIMIT || '100';
    const offset = req.query.offset || 0;
    const filter = req.query.filter || null;

    let url =
      `${baseUrl}/AudioStation/album.cgi?api=SYNO.AudioStation.Album&version=3&method=list` +
      `&_sid=${sid}` +
      `&limit=${limit}` +
      `&offset=${offset}` +
      `&sort_by=${sortBy}` +
      `&sort_direction=${sortDirection}`;

    if (artist) url += `&artist=${artist}`;
    if (filter) url += `&filter=${filter}`;

    const response = await axios.get(url);
    const albums = (response.data.data.albums as any[]).map((item) => ({
      artist: `${item.display_artist}` ? item.display_artist : item.artist,
      album: item.name,
      year: item.year,
    }));
    res.json(albums);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const song = async (req: Request, res: Response): Promise<void> => {
  try {
    const artist = req.query.artist || '';
    const album = req.query.album || '';
    const sortBy = req.query.sortBy || 'year';
    const sortDirection = req.query.sortDirection || 'asc';
    const limit = req.query.limit || process.env.SYNO_LIMIT || '100';
    const offset = req.query.offset || 0;

    let url =
      `${baseUrl}/AudioStation/song.cgi?api=SYNO.AudioStation.Song&version=3&method=list` +
      `&_sid=${sid}` +
      `&limit=${limit}` +
      `&offset=${offset}` +
      `&sort_by=${sortBy}` +
      `&sort_direction=${sortDirection}` +
      `&additional=song_tag,song_audio,song_rating`;

    if (artist) url += `&artist=${artist}`;
    if (album) url += `&album=${album}`;

    const response = await axios.get(url);
    const songs = (response.data.data.songs as any[]).map((item) => {
      let folder: IFolder = { id: item.id, title: item.title };
      if (
        item.additional &&
        item.additional.song_audio &&
        item.additional.song_tag
      ) {
        const song = populateSong(item.additional);
        folder = { ...folder, ...song };
      }
      return folder;
    });
    res.json(songs);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

const getCover = (artist?: string, album?: string): string =>
  `${baseUrl}/AudioStation/cover.cgi?api=SYNO.AudioStation.Cover&version=3&method=getcover&output_default=true&is_hr=false&view=playing` +
  `&_sid=${sid}` +
  `&artist_name=${encodeURIComponent(artist || '')}` +
  `&album_name=${encodeURIComponent(album || '')}`;

const populateSong = (additional: any): Partial<IFolder> => {
  const artist = `${additional.song_tag.album_artist}`
    ? additional.song_tag.album_artist
    : additional.song_tag.artist;
  return {
    artist: artist,
    album: additional.song_tag.album,
    duration: +additional.song_audio.duration,
    durationString: formatDuration(+additional.song_audio.duration),
    filesize: +additional.song_audio.filesize,
    filesizeString: `${(additional.song_audio.filesize / 1024 / 1024).toFixed(2)} MB`,
    disc: +additional.song_tag.disc,
    track: +additional.song_tag.track,
    genre: additional.song_tag.genre,
    year: additional.song_tag.year,
  };
};

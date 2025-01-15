import { Request, Response } from 'express';
import axios from 'axios';
import config from 'config';

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
      console.log(password);

      const url = `${SynoApiController.baseUrl}/auth.cgi?api=SYNO.API.Auth&version=7&method=login&account=${account}&passwd=${password}&format=sid`;
      console.log(url);

      const response = await axios.get(url);
      SynoApiController.sid = response.data.data.sid;
      console.log(SynoApiController.sid);
      res.json(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  public static async folder(req: Request, res: Response): Promise<void> {
    try {
      const limit = config.get<string>('synoUrl.limit');

      const url = `${SynoApiController.baseUrl}/AudioStation/folder.cgi?api=SYNO.AudioStation.Folder&version=3&method=list`
        + `&_sid=${SynoApiController.sid}`
        + `&limit=${limit}&sort_by=name&sort_direction=asc`;
      console.log(url);

      const response = await axios.get(url);
      const folders = (response.data.data.items as any[]).map((item) => ({id: item.id, title: item.title}));
      res.json(folders);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
}
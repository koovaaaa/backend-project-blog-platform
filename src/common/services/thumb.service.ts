import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class ThumbService {
  async createThumb(
    file: Express.Multer.File,
    width: number,
    height: number,
  ): Promise<void> {
    fs.mkdir(file.destination + `/${process.env.THUMBS_FOLDER}`, () => {});
    await sharp(file.path)
      .resize(width, height)
      .toFile(
        file.destination +
          `/${process.env.THUMBS_FOLDER}/${width}x${height}-` +
          file.filename,
      );
  }
}

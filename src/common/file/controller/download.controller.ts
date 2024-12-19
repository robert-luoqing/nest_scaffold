import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { FileService } from './file.service';

@Controller('download')
export class DownloadController {
  constructor(private fileService: FileService) {}
  @Get(':filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.fileService.getFullPathByFileName(filename);
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      return res.download(filePath, (err) => {
        if (err) {
          res.status(500).send('Could not download the file');
        }
      });
    } else {
      return res.status(404).send('File not found');
    }
  }
}

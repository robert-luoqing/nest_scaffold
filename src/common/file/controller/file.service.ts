import { ConfigService } from './../../config/config.service';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private folder: string;
  constructor(private configService: ConfigService) {
    this.folder = configService.appConfig.file.filePath;
    if (!this.folder) {
      this.folder = path.join(__dirname, '..', 'uploads');
    }
  }

  getFullPathByFileName(filename: string): string {
    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder, { recursive: true });
    }

    return path.join(this.folder, filename);
  }

  // async saveFile(file: Express.Multer.File) {
  // 生产环境过不了
  async saveFile(file: any) {
    // 自定义文件名并保存文件
    const filename = `${uuidv4()}-${file.originalname}`;
    const filePath = this.getFullPathByFileName(filename);
    await fs.promises.writeFile(filePath, file.buffer); // 使用 fs 模块保存文件
    return filename;
  }

  generalRandomFullFilename(extName: string): {
    fullName: string;
    filename: string;
  } {
    const filename = `${uuidv4()}.${extName}`;
    const filePath = this.getFullPathByFileName(filename);
    return { fullName: filePath, filename };
  }
}

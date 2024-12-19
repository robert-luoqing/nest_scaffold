import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './file.service';

@Controller('upload')
export class UploadController {
  constructor(private fileService: FileService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file')) // 不使用 diskStorage，这样文件数据会被放在内存中
  async uploadFile(@UploadedFile() file: any) {
    const filename = await this.fileService.saveFile(file);

    console.log(file); // 可以查看上传的文件信息

    return { message: 'File uploaded successfully', filename };
  }

  // @Post('files')
  // @UseInterceptors(
  //   FilesInterceptor('files', 10, {
  //     // 10 是最大上传文件数量
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const filename = `${uuidv4()}-${file.originalname}`;
  //         cb(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
  //   console.log(files);
  //   return { message: 'Files uploaded successfully', files };
  // }
}

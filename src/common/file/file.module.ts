import { Global, Module } from '@nestjs/common';
import { UploadController } from './controller/upload.controller';
import { DownloadController } from './controller/download.controller';
import { FileService } from './controller/file.service';

@Global()
@Module({
  controllers: [UploadController, DownloadController],
  providers: [FileService],
  exports: [FileService],
})
export class UploadModule {}

import { Global, Module } from '@nestjs/common';
import { ExcelService } from './service/excel.service';

@Global()
@Module({
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}

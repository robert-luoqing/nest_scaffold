import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
// import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

@Injectable()
export class ExcelService {
  openXlsx(filePath: string): xlsx.WorkBook {
    return xlsx.readFile(filePath);
  }
  async readExcelFileWithHeaders<T>(
    filePath: string,
    titleMap?: Record<string, string>,
  ): Promise<T[]> {
    const fileBuffer = await fsPromises.readFile(filePath); // 异步读取文件
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' }); // 解析文件

    // const workbook = this.openXlsx(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // 读取为二维数组

    // 读取第一行作为标题
    const headers: any = data[0];

    // 提取数据行，忽略第一行标题
    const dataRows = data.slice(1);
    const productData: any[] = [];
    for (const row of dataRows) {
      const product: any = {};
      let hasValue = false;
      headers.forEach((header, index) => {
        let fieldName = header;
        if (titleMap?.[header]) {
          fieldName = titleMap?.[header];
        }
        if (row[index]) {
          hasValue = true;
        }
        product[fieldName] = row[index]; // 将每一列的标题作为属性
      });
      if (hasValue) {
        productData.push(product);
      } else {
        break;
      }
    }

    return productData;
  }

  updateCell(worksheet: xlsx.WorkSheet, cellName: string, value: string) {
    worksheet[cellName] = { v: value };
  }

  writeToExcel<T>(
    data: T[],
    titles: string[],
    fullFileName: string,
    titleMap?: Record<string, string>,
  ): void {
    const newTitles = [...titles];
    for (let i = 0; i < newTitles.length; i++) {
      if (titleMap?.[newTitles[i]]) {
        newTitles[i] = titleMap?.[newTitles[i]];
      }
    }

    // 将数据转换为数组，以便写入 Excel
    const worksheetData = [
      newTitles, // 首行作为标题
      ...data.map((item) => titles.map((title) => item[title])), // 后续行作为数据
    ];

    // 创建工作表
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);

    // 创建工作簿并添加工作表
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 将工作簿写入文件
    xlsx.writeFile(workbook, fullFileName);
  }

  generateExcel(
    data: any[],
    fields: { key: string; title: string; width: number }[],
  ): Buffer {
    // 1. 构造表格数据
    const tableData = [
      fields.map((field) => field.title), // 设置标题行
      ...data.map(
        (item) => fields.map((field) => item[field.key] || ''), // 提取指定字段的数据
      ),
    ];

    // 2. 将表格数据转换为工作表
    const ws = xlsx.utils.aoa_to_sheet(tableData);

    // 3. 设置列宽度
    ws['!cols'] = fields.map((field) => ({ wch: field.width }));

    // 4. 创建工作簿并附加工作表
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 5. 导出为 Excel 文件
    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    return buffer;
  }
}

import { isNil } from 'lodash';
class ConverterUtil {
  convertToNumber(str?: string | number | null): number | null {
    if (isNil(str)) {
      return null;
    }
    if (typeof str === 'string') {
      let lowerStr = str.trim().toLowerCase();
      if (lowerStr === 'null' || lowerStr === 'undefined') {
        return null;
      }
      if (lowerStr === '-') {
        return null;
      }

      lowerStr = lowerStr.replace(/,/g, '');
      lowerStr = lowerStr.replace(/\$/g, '');
      lowerStr = lowerStr.replace(/¥/g, '');
      const result = Number(lowerStr);
      if (String(result) === 'NaN') {
        console.log(result);
        return null;
      }
      return result;
    } else {
      return str;
    }
  }
}

export const converterUtil = new ConverterUtil();

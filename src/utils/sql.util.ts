import { OrderByCondition } from 'typeorm';

class SqlUtil {
  xLike(str: string, type: 'left' | 'right' | 'both' = 'both') {
    const escapeStr = str.replace(/[%_?']/g, '\\$&');
    switch (type) {
      case 'both':
        return `%${escapeStr}%`;
      case 'left':
        return `%${escapeStr}`;
      case 'right':
        return `${escapeStr}%`;
    }
  }

  xStr(str: any): string {
    const escapeStr = String(str).replace(/[']/g, '\\$&');
    return escapeStr;
  }

  xNum(num: string | number | null | undefined): string {
    return String(Number(num));
  }

  xBool(val: string | boolean | null | undefined): string {
    return Boolean(val) ? '1' : '0';
  }

  xNumWithIn(nums: number[]): string {
    return nums.map((item) => Number(item)).join(',');
  }

  xOrder(
    prefix: string,
    orders: Array<{ fieldName: string; sortType: 'asc' | 'desc' | null }>,
  ): OrderByCondition {
    const sortObj: OrderByCondition = {};
    const p = prefix ? prefix + '.' : '';
    for (const order of orders) {
      if (order.fieldName) {
        sortObj[p + this.xStr(order.fieldName)] =
          order.sortType.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
      }
    }

    return sortObj;
  }
}

export const sqlUtil = new SqlUtil();

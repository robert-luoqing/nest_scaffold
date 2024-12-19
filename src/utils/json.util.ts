import { isNil } from 'lodash';

class JsonUtil {
  safeParse(val: any, defaultObj?: any) {
    if (isNil(val)) {
      return null;
    }

    if (typeof val === 'object') {
      return val;
    }

    try {
      return JSON.parse(val);
    } catch (e: any) {
      console.log('safeParse error', e);
      return defaultObj || null;
    }
  }
}

export const jsonUtil = new JsonUtil();

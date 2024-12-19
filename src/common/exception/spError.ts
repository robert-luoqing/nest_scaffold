import { SPErrorType } from './spErrorType';

export class SPError {
  public code: SPErrorType;
  public message: string;
  constructor(code: SPErrorType, message: string) {
    this.code = code;
    this.message = message;
  }
}

const enum ResponseMessage {
  SUCCESS = 'SUCCESS',
}

interface ResponseModelOptions {
  message?: string;
}

export class ResponseModel<T> {
  data: T;
  message: string;

  constructor(data: T, options?: ResponseModelOptions) {
    this.data = data;
    this.message = options?.message || ResponseMessage.SUCCESS;
  }
}

interface JsonResponseProps {
  status?: number;
  message?: string;
  data?: Record<string, any> | Record<string, any>[];
}

export class JsonResponse {
  public status: JsonResponseProps['status'];
  public message: JsonResponseProps['message'];
  public data: JsonResponseProps['data'];

  constructor(props: JsonResponseProps) {
    this.status = props.status || 200;
    this.message = props.message || 'Success';
    this.data = props.data || {};
  }
}

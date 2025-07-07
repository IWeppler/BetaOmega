export const catchedController = (controller: any) => {
  return async (req: any, res: any, next: any) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
};

export class ClientError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

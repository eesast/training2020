// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserModel } from "../../models/user";

declare global {
  namespace Express {
    interface Auth extends Partial<UserModel> {
      tokenValid?: boolean;
      selfCheckRequired?: boolean;
    }

    export interface Request {
      auth: Auth;
      params: {
        id?: number;
        category?: string;
      };
      file: {
        filename?: string;
      };
    }
  }
}

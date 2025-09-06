import { UserRequestType } from "../../src/types.ts";

declare global{
    namespace Express {
        interface Request {
            user?: UserRequestType
        }
    }
}

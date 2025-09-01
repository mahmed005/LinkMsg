import { DefaultEventsMap, Socket } from "socket.io";

export interface CustomSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
    user?: any
};
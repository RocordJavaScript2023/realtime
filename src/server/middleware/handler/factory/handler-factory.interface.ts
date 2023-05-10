import { HandlerFunction } from "@/lib/types/handler-function.type";
import { Chainable } from "../chainable.interface";

export interface HandlerFactory<Req extends Request, Res extends Response ,C extends Chainable<Req, Res>> {
    create(pathComponent?: string, handlerFunction?: HandlerFunction<Req, Res>): C;
}
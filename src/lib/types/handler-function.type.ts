export type HandlerFunction<Req extends Request, Res extends Response> = (request: Req) => Res

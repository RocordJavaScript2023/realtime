import type { HandlerFunction } from "@/lib/types/handler-function.type";

export interface Chainable<Req extends Request, Res extends Response> {

    getPathComponent(): string;

    setPathComponent(component: string): Chainable<Req, Res>;

    getNext(): Chainable<Req, Res> | null;

    setNext(next: Chainable<Req, Res>): Chainable<Req, Res>;

    setHandle(fn: HandlerFunction<Req, Res>): Chainable<Req, Res>

    handleRequest(request: Req): Promise<Res | null>;
}
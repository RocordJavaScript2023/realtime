import { filterUrl } from "@/lib/util/filter/filter-url";
import type { HandlerFunction } from "@/lib/types/handler-function.type";
import { Chainable } from "./chainable.interface";

export class RequestHandler<Req extends Request, Res extends Response> implements Chainable<Req, Res> {
    
    private pathComponent: string;

    private next: Chainable<Req, Res> | null = null;

    private handle: HandlerFunction<Req, Res> | null;
    
    public constructor(
        pathComponent?: string,
        next?: Chainable<Req, Res>,
        handle?: HandlerFunction<Req, Res>
    ) {
        if(pathComponent !== null && typeof pathComponent !== 'undefined') {
            this.pathComponent = pathComponent;
        } else {
            this.pathComponent = "/";
        }

        if(next !== null && typeof next !== 'undefined') {
            this.next = next;
        } else {
            this.next = null;
        }

        if(handle !== null && typeof handle !== 'undefined') {
            this.handle = handle;
        } else {
            this.handle = null;
        }
    }
    
    getPathComponent(): string {
        throw new Error("Method not implemented.");
    }
    
    setPathComponent(component: string): Chainable<Req, Res> {
        throw new Error("Method not implemented.");
    }
    
    getNext(): Chainable<Req, Res> | null {
        return this.next;
    }
    
    setNext(next: Chainable<Req, Res>): Chainable<Req, Res> {
        this.next = next;
        return this;
    }

    setHandle(fn: HandlerFunction<Req, Res>): Chainable<Req, Res> {
        this.handle = fn;
        return this;   
    }

    async handleRequest(request: Req): Res | null {
        
        if(this.handle !== null && typeof this.handle !== 'undefined') {
            const requestPath = filterUrl(request);

            if(requestPath === this.pathComponent) {

                return await this.handle(request)

            } else {

                if(this.next !== null && typeof this.next !== 'undefined') {

                    return this.next.handleRequest(request);

                } else {

                    return null;

                }
            }
        }

        throw new Error('RequestHandler has not been assigned a handler function!');
    }
    
}
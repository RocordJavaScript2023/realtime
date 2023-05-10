import { Chainable } from "@/server/middleware/handler/chainable.interface";

class MiddleWareDriver<Req extends Request, Res extends Response> {

    private defaultResponse: Res;

    private handlerChain: Chainable<Req, Res> | null;

    public constructor(
        defaultResponse: Res,
        handlerChain?: Chainable<Req, Res>
    ) {
        this.defaultResponse = defaultResponse;
        
        if(handlerChain !== null && typeof handlerChain !== 'undefined') {
            this.handlerChain = handlerChain;
        } else {
            this.handlerChain = null;
        }
    }

    public handleRequest(request: Req): Res {
        if(this.handlerChain !== null && typeof this.handlerChain !== 'undefined') {
            try {
                const response: Res | null = this.handlerChain.handleRequest(request);

                if(response !== null && typeof response !== 'undefined') {
                    return response;
                } else {
                    return this.returnDefaultResponse(request);
                }

            } catch (e: any | unknown) {
                // TODO: Logging?
                return this.returnDefaultResponse(request);
            }
        }

        return this.returnDefaultResponse(request);
    }

    private returnDefaultResponse(request: Req): Res {
        return this.defaultResponse;
    }

}
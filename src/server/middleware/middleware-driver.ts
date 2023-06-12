import { Chainable } from "@/server/middleware/handler/chainable.interface";

export class MiddleWareDriver<Req extends Request, Res extends Response> {
  private defaultResponse: Res;

  private handlerChain: Chainable<Req, Res> | null;

  public constructor(defaultResponse: Res, handlerChain?: Chainable<Req, Res>) {
    this.defaultResponse = defaultResponse;

    if (handlerChain !== null && typeof handlerChain !== "undefined") {
      this.handlerChain = handlerChain;
    } else {
      this.handlerChain = null;
    }
  }

  public appendToChain(
    chainable: Chainable<Req, Res>
  ): MiddleWareDriver<Req, Res> {
    if (
      this.handlerChain !== null &&
      typeof this.handlerChain !== "undefined"
    ) {
      let next: Chainable<Req, Res> | null = this.handlerChain.getNext();

      if (next !== null && typeof next !== "undefined") {
        while (
          next !== null &&
          typeof next !== "undefined" &&
          next.getNext() !== null &&
          typeof next.getNext() !== "undefined"
        ) {
          next = next.getNext();
        }

        next!.setNext(chainable);
      } else {
        next!.setNext(chainable);
      }
    } else {
      this.handlerChain = chainable;
    }

    return this;
  }

  public async handleRequest(request: Req): Promise<Res> {
    if (
      this.handlerChain !== null &&
      typeof this.handlerChain !== "undefined"
    ) {
      try {
        const response: Res | null = await this.handlerChain.handleRequest(request);

        if (response !== null && typeof response !== "undefined") {
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

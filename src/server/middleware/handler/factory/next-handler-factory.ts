import { NextRequest, NextResponse } from "next/server";
import { HandlerFactory } from "./handler-factory.interface";
import { Chainable } from "../chainable.interface";
import { RequestHandler } from "../request-handler";
import { HandlerFunction } from "@/lib/types/handler-function.type";

export class NextHandlerFactory implements HandlerFactory<NextRequest, NextResponse, Chainable<NextRequest, NextResponse>> {


    private _create(): Chainable<NextRequest, NextResponse> {
        return new RequestHandler<NextRequest, NextResponse>();
    }



    public create(pathComponent?: string, handlerFunction?: HandlerFunction<NextRequest, NextResponse>): Chainable<NextRequest, NextResponse> {
        
        const requestHandler: Chainable<NextRequest, NextResponse> = this._create();


        if(pathComponent !== null && typeof pathComponent !== 'undefined') {

            requestHandler.setPathComponent(pathComponent);
        }

        if(handlerFunction !== null && typeof handlerFunction !== 'undefined') {
            
            requestHandler.setHandle(handlerFunction);
        }


        return requestHandler;
    }
    
}
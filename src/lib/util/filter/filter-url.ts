
export function filterUrl<Req extends Request>(request: Req): string {
    const fullUrl: string = request.url;


    return fullUrl;
}
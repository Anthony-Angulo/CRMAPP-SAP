import {Injectable} from '@angular/core'
import {HttpEvent,HttpInterceptor,HttpHandler,HttpRequest} from '@angular/common/http'
import { from, Observable } from 'rxjs'
import {Storage} from '@ionic/storage'
import {mergeMap} from 'rxjs/operators'
@Injectable()
export class AddTokenInterceptor implements HttpInterceptor{
    constructor(private storage:Storage){}


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        
        if(request.url.endsWith("login"))
        return next.handle(request)

        let promise = this.storage.get('TOKEN_KEY');
        return from(promise)
        .pipe(mergeMap(token=>{
            let cloneReq=this.addToken(request,token);
            return next.handle(cloneReq)
        }
        ))
}

private addToken(request:HttpRequest<any>,token:any){
    if(token){
        let clone:HttpRequest<any>;
        clone=request.clone({
            setHeaders:{
                Accept:'application/json',
                'Content-Type':'application/json',
                Authorization: `Bearer ${token}`
            }
        })        
        return clone
    }
    return request;
}
}

function mergemap(arg0: (token: any) => Observable<HttpEvent<any>>): import("rxjs").OperatorFunction<any, HttpEvent<any>> {
    throw new Error('Function not implemented.');
}

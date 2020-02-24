export interface HttpResponse {
    success: boolean;
    responseType: XMLHttpRequestResponseType;
    response: any;      // 根据请求的类型不同，可能返回的是字符串、ArrayBuffer或Blob对象，因此使用any类型
}

export type RequestCB = ( ( response: HttpResponse ) => void );

export class HttpRequest {


    /**
     * 同步GET请求
     * @param url { string } 请求资源的url
     */
    public static doGet( url: string ): HttpResponse {
        // 初始化XMLHttpRequest对象
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        // XHR的open函数的第三个参数true表示异步请求，false表示同步请求
        // 本函数是同步请求的函数，因此为false
        xhr.open( 'get', url, false, null, null );
        // 向服务器发送请求
        xhr.send();
        // 请求发送成功
        if ( xhr.status == 200 ) {
            // 返回自己定义的HttpReponse接口对象
            // 这里可以看到接口的第二种用法
            // 并没有实现该接口，但是可以用大括号及键值对方式来定义接口（其实和js定义对象的方式一样）
            return {
                success: true,
                responseType: 'text',
                response: xhr.response
            };
        } else {
            // 请求失败，success标记为false，response 返回null
            return {
                success: false,
                responseType: 'text',
                response: null
            };
        }
    }

    /**
     * 异步GET请求
     * @param url { string } 要请求的URL地址
     * @param callback { ( response: HttpResponse ) => void  } 请求成功后的回调函数
     */
    public static doGetAsync( url: string, callback: RequestCB, responseType: XMLHttpRequestResponseType = "text" ): void {
        let xhr: XMLHttpRequest = new XMLHttpRequest();

        // 在异步请求中，可以自己决定请求的资源类型，但在同步请求中却不可以
        xhr.responseType = responseType;
        xhr.onreadystatechange = ( ev: Event ): void => {
            if ( xhr.readyState == 4 && xhr.status === 200 ) {
                // 异步请求成功，返回标记成功的HttpResponse对象，response为请求资源的数据
                let response: HttpResponse = { success: true, responseType: responseType, response: xhr.response };
                callback( response );
            } else {
                // 异步请求失败，返回标记失败的HttpResponse对象，response为null
                let response: HttpResponse = { success: false, responseType: responseType, response: null };
                callback( response );
            }
        };
        xhr.open( "get", url, true, null, null );
        xhr.send();
    }
}
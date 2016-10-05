import { Injectable } from '@angular/core';
import { SpinnerComponent } from '../spinners/spinner.component';
import { Http, Response, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { NlsService } from '../nls/nls.service';
import { ModalsService } from '../modals/modals.service';
import { SpinnersService } from '../spinners/spinners.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Prepares all the handlers to show all the spinners and errors
 *
 * @param options
 * - spinner: reference to Chayka.Spinners.spinner or false if no spinners needed
 * - spinnerId: id for generalSpinner
 * - spinnerFieldId: field id for showing spinner in the form field (uses formValidator)
 * - spinnerMessage: message to show with spinner
 * - errorMessage: default error message to show in case of error. Pass 'false' to suppress.
 * - successMessage: default success message to show in case of success. Pass 'false' to suppress.
 * - formValidator: reference to Chayka.Forms.formValidator
 * - validateOnSend: set to false if you don't want automatic validation
 * - scope: scope to call $apply in callbacks
 * - success: function(data, status, headers, config)
 * - error: function(data, status, headers, config)
 * - complete: function(data, status, headers, config)
 *
 * @returns {*}
 */
export interface AjaxRequestArgs extends RequestOptionsArgs {
    /**
     * Spinner instance that should be shown while request is being handled.
     * If omitted, general spinner will be used.
     * If set to false, no spinner will be shown at all.
     */
    spinner?: SpinnerComponent|boolean,

    /**
     * Form field with async validation that should show it's own internal spinner
     */
    spinnerField?: any,

    /**
     * Message to show with spinner
     */
    spinnerMessage?: string,

    /**
     * Default success message to show in case of error. Pass 'false' to suppress.
     */
    successMessage?: string | boolean,

    /**
     * Default error message to show in case of error. Pass 'false' to suppress.
     */
    errorMessage?: string | boolean,

    /**
     * Form validator
     */
    validator?: NgForm,

    /**
     * Marks if form validator should check data before request
     */
    validate?: boolean,

}

@Injectable()
export class AjaxService {
    /**
     * Mapping to custom response payload field.
     * Default value 'payload', means payload will be fetched from {payload: ...}
     *
     * @type {string}
     */
    protected _responsePayloadField: string = 'payload';

    /**
     * Mapping to custom response code field.
     * Default value 'code', means payload will be fetched from {code: ...}
     *
     * @type {string}
     */
    protected _responseCodeField: string = 'code';

    /**
     * Mapping to custom response message field.
     * Default value 'message', means payload will be fetched from {message: ...}
     *
     * @type {string}
     */
    protected _responseMessageField: string = 'message';


    set responsePayloadField(value: string) {
        this._responsePayloadField = value;
    }

    set responseCodeField(value: string) {
        this._responseCodeField = value;
    }

    set responseMessageField(value: string) {
        this._responseMessageField = value;
    }

    constructor(
        private http: Http,
        private modals: ModalsService,
        private spinners: SpinnersService,
        private nls: NlsService
    ){

    }

    /**
     * Perform a request.
     *
     * @param {string }url
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    request<T>(url: string, options: AjaxRequestArgs = {}): Observable<T>{

        options = <AjaxRequestArgs> Object.assign({
            spinnerMessage: this.nls._('Processing...'),
            errorMessage: this.nls._('Operation failed'),
            successMessage: false,
            validate: true,
        }, options);

        if(!options.validate || !options.validator || options.validator.valid){
            /**
             * Show spinner
             */
            let generalSpinner: string = null;
            if(options.spinner){
                (<SpinnerComponent> options.spinner).show(options.spinnerMessage);
            }else if(options.spinner === undefined){
                generalSpinner = this.spinners.show(options.spinnerMessage);
            }

            let onComplete = () => {
                /**
                 * Hide spinner
                 */
                if(options.spinner){
                    (<SpinnerComponent> options.spinner).hide();
                }else if(options.spinner === undefined){
                    this.spinners.hide(generalSpinner);
                }
            };

            let onError = (error: any) => {
                if(options.errorMessage){
                    this.modals.alert(<string> options.errorMessage);
                }
                // console.dir({error});
                onComplete();
                return error;
            };

            let parseResponse = (res: Response): T => {
                let json: any = null;
                try{
                    json = res.json();
                }catch(e){
                    let text = res.text();
                    // let rawJson = text.match(/{.*}/m);
                    let rawJson = /{[^]*}/m.exec(text);
                    // console.dir({text, rawJson});
                    try{
                        json = rawJson && JSON.parse(rawJson[0]);
                    }catch(e){
                        json = null;
                    }
                }
                if(options.successMessage){
                    this.modals.alert(<string> options.successMessage);
                }
                // console.dir({res, json});

                return json && json[this._responsePayloadField] || null;
            };

            let source = <Observable<T>> this.http.request(url, options)
                .do(onComplete)
                .map(parseResponse)
                .catch(onError);
            return source;
        }

        return <Observable<T>> Observable.throw(this.nls._('Provided data is non valid'));
    }

    /**
     * Perform GET request
     *
     * @param {string} url
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    get<T>(url: string, options: AjaxRequestArgs = {}) : Observable<T> {
        options.method = RequestMethod.Get;
        return <Observable<T>> this.request(url, options);
    }

    /**
     * Perform POST request
     *
     * @param {string} url
     * @param {any} body
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    post<T>(url: string, body: any, options: AjaxRequestArgs = {}) : Observable<T> {
        options.method = RequestMethod.Post;
        options.body = body;
        return <Observable<T>> this.request(url, options);
    }

    /**
     * Perform PUT request
     * @param {string} url
     * @param {any} body
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    put<T>(url: string, body: any, options: AjaxRequestArgs = {}) : Observable<T> {
        options.method = RequestMethod.Put;
        options.body = body;
        return <Observable<T>> this.request(url, options);
    }

    /**
     * Perform DELETE request
     * @param {string} url
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    del<T>(url: string, options: AjaxRequestArgs = {}) : Observable<T>{
        options.method = RequestMethod.Delete;
        return <Observable<T>> this.request(url, options);
    }

    /**
     * Perform PATCH request
     * @param {string} url
     * @param {any} body
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    patch<T>(url: string, body: any, options: AjaxRequestArgs = {}) : Observable<T>{
        options.method = RequestMethod.Patch;
        options.body = body;
        return <Observable<T>> this.request(url, options);
    }

    /**
     * Perform HEAD request
     * @param {string} url
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    head<T>(url: string, options: AjaxRequestArgs = {}) : Observable<T>{
        options.method = RequestMethod.Head;
        return <Observable<T>> this.request(url, options);
    }

    /**
     * Perform OPTIONS request
     * @param {string} url
     * @param {AjaxRequestArgs} options
     * @return {Observable<T>}
     */
    options<T>(url: string, options: AjaxRequestArgs = {}) : Observable<T>{
        options.method = RequestMethod.Options;
        return <Observable<T>> this.request(url, options);
    }

    /**
     * Generate http query
     *
     * @param {any} data
     * @return {string}
     */
    buildQuery(data: any): string {
        let buildQuery = (obj: any, httpParam: string = ''):string => {
            switch(typeof obj){
                case 'object':
                    if(obj instanceof Date){
                        return encodeURIComponent(httpParam) + '=' + JSON.stringify(obj);
                    }else if(obj === null){
                        return encodeURIComponent(httpParam) + '=';
                    }else if(Array.isArray(obj)){
                        let arr: string[] = [];
                        obj.forEach( val => {
                            arr.push(buildQuery(val, (httpParam || 'arr')+'[]'));
                        });
                        return arr.join('&');
                    }else{
                        let arr: string[] = [];
                        Object.keys(obj).forEach( key => {
                            arr.push(buildQuery(obj[key], httpParam ? `${httpParam}[${key}]` : key ));
                        });
                        return arr.join('&');
                    }
                case 'undefined':
                    return encodeURIComponent(httpParam) + '=';
                case 'boolean':
                    return encodeURIComponent(httpParam) + '=' + ( obj ? 'true' : 'false');
                case 'string':
                case 'number':
                default:
                    return encodeURIComponent(httpParam) + '=' + encodeURIComponent(obj);
            }
        };

        return buildQuery(data);
    }

    /**
     * Generate url with get params
     * @param {string} url
     * @param {any} data
     * @return {string}
     */
    buildGetQueryUrl(url: string, data: any): string {
        return `${url}?${this.buildQuery(data)}`;
    }
}

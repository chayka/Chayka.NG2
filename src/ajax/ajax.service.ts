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

        options = <AjaxRequestArgs> Object.assign(options, {
            spinnerMessage: this.nls._('Processing...'),
            errorMessage: this.nls._('Operation failed'),
            successMessage: false,
            validate: true,
        });

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

            let onError = (error) => {
                if(options.errorMessage){
                    this.modals.alert(<string> options.errorMessage);
                }
                console.dir({error});
                return error;
            };

            let parseResponse = (res: Response): T => {
                let json: any = null;
                try{
                    json = res.json();
                }catch(e: Error){
                    let text = res.text();
                    let rawJson = text.match(/\{.*}\s*$/);
                    try{
                        json = rawJson && JSON.parse(rawJson[0]);
                    }catch(e: Error){
                        json = null;
                    }
                }

                return json && json[this._responsePayloadField] || null;
            };

            let source = this.http.request(url, options)
                .do(onComplete)
                .map(parseResponse)
                .catch(onError);
            return source;
        }

        return Observable.throw(this.nls._('Provided data is non valid'));
    }

    get<T>(url: string, options?: RequestOptionsArgs = {}) : Observable<T> {
        options.method = RequestMethod.Get;
        return this.request(url, options);
    }

    post<T>(url: string, body: any, options?: RequestOptionsArgs) : Observable<T> {
        options.method = RequestMethod.Post;
        options.body = body;
        return this.request(url, options);
    }

    put<T>(url: string, body: any, options?: RequestOptionsArgs) : Observable<T> {
        options.method = RequestMethod.Put;
        options.body = body;
        return this.request(url, options);
    }

    del<T>(url: string, options?: RequestOptionsArgs) : Observable<Response>{
        options.method = RequestMethod.Delete;
        return this.request(url, options);
    }

    patch<T>(url: string, body: any, options?: RequestOptionsArgs) : Observable<T>{
        options.method = RequestMethod.Patch;
        options.body = body;
        return this.request(url, options);
    }

    head<T>(url: string, options?: RequestOptionsArgs) : Observable<T>{
        options.method = RequestMethod.Head;
        return this.request(url, options);
    }

    options<T>(url: string, options?: RequestOptionsArgs) : Observable<T>{
        options.method = RequestMethod.Options;
        return this.request(url, options);
    }

    buildGetQuery(data: any): string {
        return data.toString();
    }

    buildGetQueryUrl(url: string, data: any): string {
        return `${url}?${this.buildGetQuery(data)}`;
    }
}

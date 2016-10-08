import { Directive, Input, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateConfigInterface, ValidateAbstractDirective } from './validate.abstract.directive';
import { NlsService } from '../nls/nls.service';
import { AjaxService } from '../ajax/ajax.service';

/**
 * Custom validation config interface
 */
export interface ValidateCustomConfigInterface extends ValidateConfigInterface {

    /**
     * Custom validation function
     *
     * @param {(any) => boolean}
     */
    validate?: (value: any) => boolean;
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-custom]="{validate: validateSalary, message: 'Salary is too low'}">
 *      ...
 * </form-field>
 *
 *      or
 *
 * <form-field [validate-custom]="{validate: value => value > 5000, message: 'Salary is too low'}">
 *      ...
 * </form-field>
 *
 *      or
 *
 * <form-field [validate-custom]="value => value > 5000">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-custom]',
    providers: [ NlsService ]
})
export class ValidateCustomDirective extends ValidateAbstractDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'validate';

    /**
     * User config
     *
     * @type {ValidateCustomConfigInterface}
     */
    @Input('validate-custom') userConfig: ValidateCustomConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateCustomConfigInterface}
     */
    defaultConfig: ValidateCustomConfigInterface = {
        message: 'validate-custom-message',
        isActive: true,
        validate: null,
    };

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

    /**
     * Setting up nls
     *
     * @param {NlsService} nls
     */
    constructor(protected nls: NlsService){
        super(nls);
        this.nls.extendDictionary('en-US', {
            'validate-custom-message': 'Entered value is invalid',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-custom-message': 'Введенные данные неверны',
        });
    }

    /**
     * Validate input
     *
     * @return {boolean}
     */
    validate(): boolean {
        let config: ValidateCustomConfigInterface = this.config;
        let value = this.getValue();

        return !config.isActive || !config.validate || config.validate(value);
    }
}

/**
 * Custom async validation config interface
 */
export interface ValidateAsyncConfigInterface extends ValidateConfigInterface {

    /**
     * Custom validation function.
     * Should respond with null if async call is performed
     *
     * @param {(value: any, callback: (value: any, isValid: boolean, message?: string) => void) => boolean | null}
     */
    validate?: (value: any, callback: (value: any, isValid: boolean, message?: string) => void) => boolean | null;

    /**
     * Callback that is called upon completion
     *
     * @param {any} value
     * @param {boolean} isValid
     */
    callback?: (value: any, isValid: boolean, message?: string) => void;

    /**
     * Defines if cache should be used
     */
    useCache?: boolean;
}

interface AsyncCacheItemInterface {
    isValid: boolean | null,
    message?: string,
}
/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-custom]="{validate: validateSalary, message: 'Salary is too low'}">
 *      ...
 * </form-field>
 *
 *      or
 *
 * <form-field [validate-custom]="{validate: value => value > 5000, message: 'Salary is too low'}">
 *      ...
 * </form-field>
 *
 *      or
 *
 * <form-field [validate-custom]="value => value > 5000">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-custom]',
    providers: [ NlsService ]
})
export class ValidateAsyncDirective extends ValidateAbstractDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'message';

    /**
     * User config
     *
     * @type {ValidateAsyncConfigInterface}
     */
    @Input('validate-async') userConfig: ValidateAsyncConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateCustomConfigInterface}
     */
    defaultConfig: ValidateAsyncConfigInterface = {
        message: 'validate-async-message',
        isActive: true,
        validate: null,
        callback: null,
        useCache: true,
    };

    cache: any = {};

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

    /**
     * Setting up nls
     *
     * @param {NlsService} nls
     */
    constructor(protected nls: NlsService){
        super(nls);
        this.nls.extendDictionary('en-US', {
            'validate-async-message': 'Entered value is invalid',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-async-message': 'Введенные данные неверны',
        });
    }

    /**
     * Validate input
     *
     * @return {boolean}
     */
    validate(): boolean {
        let config: ValidateAsyncConfigInterface = this.config;
        let value = this.getValue();
        let cacheId = ''+value;
        let valid = null;
        if(config.isActive){
            if(config.useCache){
                valid = this.cache[cacheId] && this.cache[cacheId].isValid;
            }
            if(valid === undefined){
                this.cache[cacheId] = <AsyncCacheItemInterface>{isValid: null};
                valid = null;
                if(config.validate){
                    let callback = (value: any, isValid: boolean, message?: string) => {
                        this.cache[cacheId] = {isValid, message};
                        if(config.callback){
                            config.callback(value, isValid, message);
                        }
                    };
                    config.validate(value, callback);
                }else{
                    return true;
                }
            }
            return valid;
        }
        return true;
    }
}

/**
 * Custom async validation config interface
 */
export interface ValidateApiConfigInterface extends ValidateAsyncConfigInterface {

    /**
     * Url that should be called to verify form field value.
     * If string provided, it can contain '{{value}}' template that will be replaced with uri-encoded value.
     * If function provided, it should return url, that will be used to check value.
     */
    url?: string|((value: any) => string);

    /**
     * Debounce timeout that will be taken before sending data.
     * Useful for on-the-fly data validation
     */
    delay?: number;
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-api]="{url: '/api/validate-data/?data={{value}}', message: 'Salary is too low', debounceTime: 500}">
 *      ...
 * </form-field>
 *
 *      or
 *
 * <form-field validate-api="/api/validate-data/{{value}}">
 *      ...
 * </form-field>
 *
 *      or
 *
 * <form-field [validate-api]="{url: getUrl}">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-api]',
    providers: [ NlsService ]
})
export class ValidateApiDirective extends ValidateAsyncDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'url';

    /**
     * User config
     *
     * @type {ValidateAsyncConfigInterface}
     */
    @Input('validate-api') userConfig: ValidateApiConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateCustomConfigInterface}
     */
    defaultConfig: ValidateApiConfigInterface = {
        message: 'validate-api-message-error',
        asyncMessage: 'validate-api-message-async',
        isActive: true,
        validate: null,
        callback: null,
        useCache: true,
        url: null,
        dalay: 500,
    };

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

    /**
     * Setting up nls
     *
     * @param {NlsService} nls
     * @param {AjaxService} ajax
     */
    constructor(protected nls: NlsService, protected ajax: AjaxService){
        super(nls);
        this.nls.extendDictionary('en-US', {
            'validate-api-message-error': 'Entered value is invalid',
            'validate-api-message-async': 'Data is being evaluated...',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-api-message-error': 'Введенные данные неверны',
            'validate-api-message-async': 'Проверка данных...',
        });
    }

    /**
     * Validate input
     *
     * @return {boolean}
     */
    validate(): boolean {
        let config = this.config;
        let value = this.getValue();
        this.userConfig.validate = (value: any, callback: (value: any, isValid: boolean, message?: string) => void): boolean => {
            let url = typeof config.url === 'function'?
                config.url(value):
                this.nls._(config.url, {value: encodeURIComponent(value)});
            this.ajax.get(url, {

            }).subscribe();
            return null;
        };

        return super.validate();
        // let config: ValidateAsyncConfigInterface = this.config;
        // let value = this.getValue();
        // let cacheId = ''+value;
        // let valid = null;
        // if(config.isActive){
        //     if(config.useCache){
        //         valid = this.cache[cacheId] && this.cache[cacheId].isValid;
        //     }
        //     if(valid === undefined){
        //         this.cache[cacheId] = <AsyncCacheItemInterface>{isValid: null};
        //
        //         let callback = (value: any, isValid: boolean, message?: string) => {
        //             this.cache[cacheId] = {isValid, message};
        //             if(config.callback){
        //                 config.callback(value, isValid, message);
        //             }
        //         };
        //
        //         config.validate(value, callback);
        //     }
        //     return valid;
        // }
        // return true;
    }
}

import { Directive, Input, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateConfigInterface, ValidateAbstractDirective } from './validate.abstract.directive';
import { NlsService } from '../nls/nls.service';

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

                let callback = (value: any, isValid: boolean, message?: string) => {
                    this.cache[cacheId] = {isValid, message};
                    if(config.callback){
                        config.callback(value, isValid, message);
                    }
                };

                config.validate(value, callback);
            }
            return valid;
        }
        return true;
    }
}

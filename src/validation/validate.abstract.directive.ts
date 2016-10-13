import { ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NlsService } from '../nls/nls.service';
import { FormFieldComponent } from './form-field.component';

/**
 * Base directive configuration
 */
export interface ValidateConfigInterface {
    /**
     * Message that is shown on error
     */
    message?: string,

    /**
     * Message that is shown during async validation
     */
    asyncMessage?: string,

    /**
     * If validation is active
     */
    isActive?: boolean,
}

/**
 * Base validation directive class
 */
export abstract class ValidateAbstractDirective {

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
     * @type {{}}
     */
    userConfig: any = {

    };

    /**
     * Default directive config
     *
     * @type {{}}
     */
    defaultConfig: any = {
        message: 'Need to define a default validation message inside implementation class!',
        isActive: true,
    };

    /**
     * Config getter. Developer may passes his config in several forms:
     *
     * <form-field validate-required > - no custom config
     * <form-field [validate-required]="{message: 'Please fill in your name', isActive: needValidation}" > - config as object
     * <form-field [validate-required]="'Please fill in your name'" > - By default 'message' is configured
     * <form-field validate-required="Please fill in your name" > - no sense in watching constant sting
     * <form-field [validate-required]="needValidation" > - if boolean is passed, then 'isActive' is configured
     *
     * @return {{}}
     */
    get config(): any {
        let userConfig = {};
        if(this.userConfig){
            if(['string', 'number', 'function', 'symbol'].indexOf(typeof this.userConfig) >= 0){
                userConfig[this.defaultConfigField] = this.userConfig;
            }else if(typeof this.userConfig === 'object' && (this.userConfig instanceof Date || Array.isArray(this.userConfig))){
                userConfig[this.defaultConfigField] = this.userConfig;
            }else if(typeof this.userConfig === 'boolean'){
                userConfig['isActive'] = this.userConfig;
            }else{
                userConfig = this.userConfig;
            }
        }
        return Object.assign({}, this.defaultConfig, userConfig);
    }

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

    /**
     * Form-Field component, that is being injected by form-field itself.
     * @type {FormFieldComponent}
     */
    protected field: FormFieldComponent = null;

    /**
     * Set form field
     *
     * @param {FormFieldComponent} field
     */
    setFormField(field: FormFieldComponent){
        this.field = field;
    }

    /**
     * Get current input value, from [(ngModel)]
     *
     * @return {any|string}
     */
    getValue(): any {
        return this.ngModel.value;
    }

    /**
     * In implementation classes, nls dictionaries should be set up here.
     *
     * @param nls
     */
    constructor(protected nls: NlsService){

    }

    /**
     * Respond with
     *  true - when valid,
     *  false - when invalid,
     *  null - when async validation in progress
     *
     * Check if validation passes
     */
    abstract validate(): boolean | null ;

    /**
     * Get validation message
     */
    getMessage(messageConfigId: string = 'message'): string {
        let config = this.config;
        return this.nls._(config[messageConfigId] || '', config);
    }
}
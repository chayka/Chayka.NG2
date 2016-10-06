import { Directive, Input, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateConfigInterface, ValidateAbstractDirective } from './validate.abstract.directive';
import { NlsService } from '../nls/nls.service';

export interface ValidateRangeConfigInterface extends ValidateConfigInterface {
    /**
     * Lower than requirement
     */
    lt?: number,

    /**
     * Lower or equal requirement
     */
    le?: number,

    /**
     * Greater than requirement
     */
    gt?: number,

    /**
     * Greater or equal requirement
     */
    ge?: number,
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-range]="{gt: 0, le: 16, message: 'Number of years in IT, {{max}} max'}">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-range]',
    providers: [ NlsService ]
})
export class ValidateRangeDirective extends ValidateAbstractDirective {

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
     * @type {ValidateRangeConfigInterface}
     */
    @Input('validate-range') userConfig: ValidateRangeConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRangeConfigInterface}
     */
    defaultConfig: ValidateRangeConfigInterface = {
        message: '',
        isActive: true,
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
            'validate-range-message-min-max': 'The value should be between {{min}} and {{max}}',
            'validate-range-message-min': 'The value should be at least {{min}} chars',
            'validate-range-message-max': 'The value should be {{max}} chars max',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-range-message-min-max': 'Значение должно быть в рамках от {{min}} до {{max}}',
            'validate-range-message-min': 'Значения должно быть не менее {{min}}',
            'validate-range-message-max': 'Значения должно быть не более {{max}}',
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
        let valid = true;

        if(config.ge !== undefined){
            valid = valid && value >= config.ge;
        }
        if(config.gt !== undefined){
            valid = valid && value > config.gt;
        }
        if(config.le !== undefined){
            valid = valid && value <= config.le;
        }
        if(config.lt !== undefined){
            valid = valid && value < config.lt;
        }

        return !config.isActive || valid;
    }

    /**
     * Get validation message
     *
     * @return {string}
     */
    getMessage(messageConfigId: string = 'message'): string {
        let config = this.config;

        let min: number;
        if(config.ge !== undefined){
            min = config.ge;
        }
        if(config.gt !== undefined){
            min = config.gt;
        }

        let max: number;
        if(config.le !== undefined){
            max = config.le;
        }
        if(config.lt !== undefined){
            max = config.lt;
        }

        if(messageConfigId === 'message' && !config.message){
            let message = 'validate-range-message-min-max';
            if(min !== undefined && max === undefined){
                message = 'validate-range-message-min';
            }else if(min === undefined && max !== undefined){
                message = 'validate-range-message-max';
            }
            return this.nls._(message || '', Object.assign(config, {min, max}));
        }
        return this.nls._(config[messageConfigId] || '', Object.assign(config, {min, max}));
    }
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-ge]="10">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-ge]',
    providers: [ NlsService ]
})
export class ValidateGeDirective extends ValidateRangeDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'ge';

    /**
     * User config
     *
     * @type {ValidateRangeConfigInterface}
     */
    @Input('validate-ge') userConfig: ValidateRangeConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRangeConfigInterface}
     */
    defaultConfig: ValidateRangeConfigInterface = {
        message: 'validate-range-message-min',
        isActive: true,
    };

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-gt]="10">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-gt]',
    providers: [ NlsService ]
})
export class ValidateGtDirective extends ValidateRangeDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'gt';

    /**
     * User config
     *
     * @type {ValidateRangeConfigInterface}
     */
    @Input('validate-gt') userConfig: ValidateRangeConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRangeConfigInterface}
     */
    defaultConfig: ValidateRangeConfigInterface = {
        message: 'validate-range-message-min',
        isActive: true,
    };

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-le]="10">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-le]',
    providers: [ NlsService ]
})
export class ValidateLeDirective extends ValidateRangeDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'le';

    /**
     * User config
     *
     * @type {ValidateRangeConfigInterface}
     */
    @Input('validate-le') userConfig: ValidateRangeConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRangeConfigInterface}
     */
    defaultConfig: ValidateRangeConfigInterface = {
        message: 'validate-range-message-max',
        isActive: true,
    };

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-le]="10">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-lt]',
    providers: [ NlsService ]
})
export class ValidateLtDirective extends ValidateRangeDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'lt';

    /**
     * User config
     *
     * @type {ValidateRangeConfigInterface}
     */
    @Input('validate-lt') userConfig: ValidateRangeConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRangeConfigInterface}
     */
    defaultConfig: ValidateRangeConfigInterface = {
        message: 'validate-range-message-max',
        isActive: true,
    };

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;
}
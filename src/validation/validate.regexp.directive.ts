import { Directive, Input, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateConfigInterface, ValidateAbstractDirective } from './validate.abstract.directive';
import { NlsService } from '../nls/nls.service';

export interface ValidateRegExpConfigInterface extends ValidateConfigInterface {
    /**
     * RegExp to check against
     */
    regexp?: RegExp,

    /**
     * false: validation passes if value matches regexp
     * true: validation passes if value does not match regexp
     */
    forbid?: boolean,
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-regexp]="{regexp: /^\d*$/i, message: 'Digits only'}">
 *      ...
 * </form-field>
 * ```
 *  Or
 * ```
 * <form-field [validate-regexp]="{regexp: '/\b(fuck|ass|dickhead)\b/i', message: 'Behave yourself!', forbid: true}">
 *      ...
 * </form-field>
 *  Or
 * <form-field validate-regexp="/^\d*$/i">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-regexp]',
    providers: [ NlsService ]
})
export class ValidateRegExpDirective extends ValidateAbstractDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'regexp';

    /**
     * User config
     *
     * @type {ValidateRangeConfigInterface}
     */
    @Input('validate-regexp') userConfig: ValidateRegExpConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRangeConfigInterface}
     */
    defaultConfig: ValidateRegExpConfigInterface = {
        message: 'validate-regexp-message',
        isActive: true,
        forbid: false,
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
            'validate-regexp-message': 'Invalid format',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-regexp-message': 'Некорректный формат',
        });
    }

    /**
     * Since there are problems passing regexp in template, one can pass it as a string;
     * @param str
     * @return {RegExp}
     */
    parseRegExp(str: string): RegExp {
        let m  = /^\/(.*)\/(\w*)$/.exec(str);
        return m ? new RegExp(m[1], m[2]) : null;
    }

    /**
     * Validate input
     *
     * @return {boolean}
     */
    validate(): boolean {
        let config = this.config;
        let value = '' + this.getValue();
        let valid = true;

        if(config.regexp !== undefined){
            let re = typeof config.regexp === 'string' ? this.parseRegExp(config.regexp) : config.regexp;
            console.dir({re});
            let match = re.test(value);
            valid = valid && (config.forbid ? !match : match)
        }

        return !config.isActive || valid;
    }
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field validate-email>
 *      ...
 * </form-field>
 * ```
 *  Or
 * ```
 * <form-field validate-email="Please, provide valid email">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-email]',
    providers: [ NlsService ]
})
export class ValidateEmailDirective extends ValidateRegExpDirective {

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
    @Input('validate-email') userConfig: ValidateRegExpConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRangeConfigInterface}
     */
    defaultConfig: ValidateRegExpConfigInterface = {
        message: 'validate-email-message',
        isActive: true,
        regexp: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
        forbid: false,
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
            'validate-email-message': 'Invalid format (e.g. user@domain.com)',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-email-message': 'Некорректный формат (user@domain.com)',
        });
    }
}

import { Directive, Input, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateConfigInterface, ValidateAbstractDirective } from './validate.abstract.directive';
import { NlsService } from '../nls/nls.service';
import { FormFieldComponent } from './form-field.component';

/**
 * Password Complexity config interface
 */
export interface ValidatePasswordComplexityConfigInterface extends ValidateConfigInterface {

    /**
     * Min password length requirement
     */
    minLength?: number;

    /**
     * Lowercase chars required
     */
    lowercase?: boolean;

    /**
     * Uppercase chars required
     */
    uppercase?: boolean;

    /**
     * Digit chars required
     */
    digits?: boolean;

    /**
     * Non alphanumeric chars required: ~!@#$%^&*_-+=`|\(){}[]:;"'<>,.?/
     */
    nonAlNum?: boolean;

    /**
     * Number of char requirements (lowercase, uppercase, digits, nonAlNum) to meet.
     * 0 - no req
     * 1 - weak complexity
     * 2 - medium complexity
     * 3+ - strong complexity
     *
     * If set, the appropriate flags are ignored and number of requirements met are calculated.
     */
    minComplexity?: number;

    /**
     * Forbid login parts inside password if login input provided
     */
    usernameField?: FormFieldComponent;

}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-password-complexity]="{}">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-password-complexity]',
    providers: [ NlsService ]
})
export class ValidatePasswordComplexityDirective extends ValidateAbstractDirective {

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
     * @type {ValidatePasswordComplexityConfigInterface}
     */
    @Input('validate-password-complexity') userConfig: ValidatePasswordComplexityConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidatePasswordComplexityConfigInterface}
     */
    defaultConfig: ValidatePasswordComplexityConfigInterface = {
        message: '',
        isActive: true,
        minLength: 6,
        uppercase: false,
        lowercase: false,
        digits: false,
        nonAlNum: false,
        usernameField: null,
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
            'validate-password-complexity-message-min-length': 'The password should be at least {{minLength}} chars long',
            'validate-password-complexity-message-lowercase': 'The password should be contain lowercase chars',
            'validate-password-complexity-message-uppercase': 'The password should be contain uppercase chars',
            'validate-password-complexity-message-digits': 'The password should be contain digits',
            'validate-password-complexity-message-non-alphanumeric': 'The password should be contain non-alphanumeric chars',
            'validate-password-complexity-message-low-complexity': 'Entered password has low complexity',
            'validate-password-complexity-message-username-parts': 'Entered password contains parts of username',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-password-complexity-message-min-length': 'Пароль должен быть не короче {{minLength}} символов',
            'validate-password-complexity-message-lowercase': 'Пароль должен содержать символы в нижнем регистре',
            'validate-password-complexity-message-uppercase': 'Пароль должен содержать символы в верхнем регистре',
            'validate-password-complexity-message-digits': 'Пароль должен содержать цифры',
            'validate-password-complexity-message-non-alphanumeric': 'Пароль должен содержать специальные символы (~!@#$%...)',
            'validate-password-complexity-message-low-complexity': 'Введенный пароль не достаточно сложен',
            'validate-password-complexity-message-username-parts': 'Введенный пароль содержит части логина',
        });
    }

    currentMessage: string = '';

    /**
     * Check if value has uppercase chars
     *
     * @return {boolean}
     */
    hasUppercase(): boolean {
        let value = this.getValue();
        return /[a-zа-я]/.test(value);
    }

    /**
     * Check if value has lowercase chars
     *
     * @return {boolean}
     */
    hasLowercase(): boolean {
        let value = this.getValue();
        return /[A-ZА-Я]/.test(value);
    }

    /**
     * Check if value has digits
     *
     * @return {boolean}
     */
    hasDigits(): boolean {
        let value = this.getValue();
        return /\d/.test(value);
    }

    /**
     * Check if value has non alphanumeric chars
     *
     * @return {boolean}
     */
    hasNonAlphaNumeric(): boolean {
        let value = this.getValue();
        return /[^\w\d\s]/.test(value);
    }

    /**
     * Split username by non-alphanumeric chars and search parts inside password.
     *
     * @return {boolean}
     */
    hasUsernameParts(): boolean {
        let config: ValidatePasswordComplexityConfigInterface = this.config;
        let value: string = this.getValue();
        let username: string = config.usernameField && config.usernameField.value || '';
        let parts: string[] = username.split(/[\W\D]+/);
        let res = false;
        parts.forEach(part => {
            res = res || value.indexOf(part)>=0;
        });
        return res;
    }

    /**
     * Validate input
     *
     * @return {boolean}
     */
    validate(): boolean {
        let config: ValidatePasswordComplexityConfigInterface = this.config;
        let value = this.getValue();
        let error = this.currentMessage = '';

        if(config.isActive){
            if(!error && config.minLength && value.length < config.minLength){
                error = 'validate-password-complexity-message-min-length';
            }
            if(!error && this.hasUsernameParts()){
                error = 'validate-password-complexity-message-username-parts';
            }

            if(config.minComplexity){
                if(!error){
                    let complexity = 0;
                    complexity += this.hasLowercase() ? 1 : 0;
                    complexity += this.hasUppercase() ? 1 : 0;
                    complexity += this.hasDigits() ? 1 : 0;
                    complexity += this.hasNonAlphaNumeric() ? 1 : 0;
                    if(complexity < config.minComplexity){
                        error = 'validate-password-complexity-message-low-complexity';
                    }
                }
            }else{
                if(!error && this.hasLowercase()){
                    error = 'validate-password-complexity-message-lowercase';
                }
                if(!error && this.hasUppercase()){
                    error = 'validate-password-complexity-message-uppercase';
                }
                if(!error && this.hasDigits()){
                    error = 'validate-password-complexity-message-digits';
                }
                if(!error && this.hasNonAlphaNumeric()){
                    error = 'validate-password-complexity-message-non-alphanumeric';
                }
            }
        }

        this.currentMessage = error;

        return !error;
    }

    /**
     * Get validation message
     *
     * @return {string}
     */
    getMessage(messageConfigId: string = 'message'): string {
        let config = this.config;

        return this.nls._(config.message || this.currentMessage, config);
    }
}

/**
 * Password repeat config interface
 */
export interface ValidatePasswordRepeatConfigInterface extends ValidateConfigInterface {
    repeat?: FormFieldComponent
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field validate-password-complexity="medium" #pass1>
 *      ...
 * </form-field>
 *
 * <form-field [validate-password-repeat]="pass1">
 *      ...
 * </form-field>
 *
 *  or
 *
 * <form-field [validate-password-repeat]="{repeat: pass1, message: 'Passwords do not match'}">
 *      ...
 * </form-field>
 *
 * ```
 */
@Directive({
    selector: '[validate-password-repeat]',
    providers: [ NlsService ]
})
export class ValidatePasswordRepeatDirective extends ValidateAbstractDirective {

    /**
     * If user config specified in the form of string, number, then this field is considered.
     * If boolean is provided, then 'isActive' is considered.
     *
     * @type {string}
     */
    defaultConfigField: string = 'repeat';

    /**
     * User config
     *
     * @type {ValidatePasswordRepeatConfigInterface}
     */
    @Input('validate-password-repeat') userConfig: ValidatePasswordRepeatConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidatePasswordRepeatConfigInterface}
     */
    defaultConfig: ValidatePasswordRepeatConfigInterface = {
        message: 'validate-password-repeat-message',
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
            'validate-password-repeat-message': 'Entered passwords do not match',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-password-repeat-message': 'Введенные пароли не совпадают',
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
        let repeatValue = config.repeat.value;
        let valid = true;

        if(config.ge !== undefined){
            valid = valid && value === repeatValue;
        }

        return !config.isActive || valid;
    }
}
import { Directive, Input, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateConfigInterface, ValidateAbstractDirective } from './validate.abstract.directive';
import { NlsService } from '../nls/nls.service';

export interface ValidateLengthConfigInterface extends ValidateConfigInterface {
    /**
     * Min length requirement
     */
    min?: number,

    /**
     * Max length requirement
     */
    max?: number,
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field [validate-length]="{min: 0, max: 16, message: 'Pick username {{max}} chars max'}">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-length]',
    providers: [ NlsService ]
})
export class ValidateLengthDirective extends ValidateAbstractDirective {

    /**
     * User config
     *
     * @type {ValidateLengthConfigInterface}
     */
    @Input('validate-length') userConfig: ValidateLengthConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateLengthConfigInterface}
     */
    defaultConfig: ValidateLengthConfigInterface = {
        message: '',
        isActive: true,
        min: 0,
        max: Infinity,
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
            'validate-length-message-min-max': 'The value length should be between {{min}} and {{max}}',
            'validate-length-message-min': 'The value length should be at least {{min}} chars',
            'validate-length-message-max': 'The value length should be {{max}} chars max',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-length-message-min-max': 'Длина значения должна быть от {{min}} до {{max}} символов',
            'validate-length-message-min': 'Длина значения должна быть не менее {{min}} символов',
            'validate-length-message-max': 'Длина значения должна быть не более {{max}} символов',
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
        return !config.isActive || (value.length !== undefined && value.length >= config.min && value.length <= config.max);
    }

    /**
     * Get validation message
     *
     * @return {string}
     */
    getMessage(messageConfigId: string = 'message'): string {
        let config = this.config;
        if(messageConfigId === 'message' && !config.message){
            let message = 'validate-length-message-min-max';
            if(config.min > 0 && config.max === Infinity){
                message = 'validate-length-message-min';
            }else if(config.min === 0 && config.max < Infinity){
                message = 'validate-length-message-max';
            }
            return this.nls._(message || '', config);
        }
        return this.nls._(config[messageConfigId] || '', config);
    }

}
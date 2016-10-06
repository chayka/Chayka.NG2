import { Directive, Input, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateConfigInterface, ValidateAbstractDirective } from './validate.abstract.directive';
import { NlsService } from '../nls/nls.service';

export interface ValidateRequiredConfigInterface extends ValidateConfigInterface {
}

/**
 * This directive is used in <form-field> component
 *
 * ```
 * <form-field validate-required>
 *      ...
 * </form-field>
 * ```
 *  or
 * ```
 * <form-field [validate-required]="{message: 'Please, fill in {{label}}'}">
 *      ...
 * </form-field>
 * ```
 */
@Directive({
    selector: '[validate-required]',
    providers: [ NlsService ]
})
export class ValidateRequiredDirective extends ValidateAbstractDirective {

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
     * @type {ValidateRequiredConfigInterface}
     */
    @Input('validate-required') userConfig: ValidateRequiredConfigInterface = {};

    /**
     * Default config values that are used if user config is not set up
     *
     * @type {ValidateRequiredConfigInterface}
     */
    defaultConfig: ValidateRequiredConfigInterface = {
        message: 'validate-require-message',
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
            'validate-require-message': 'This field is required',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-require-message': 'Данное поле обязательно для заполнения',
        });
    }

    /**
     * Validate input
     *
     * @return {boolean}
     */
    validate(): boolean {
        return !this.config.isActive || !!this.getValue();
    }
}
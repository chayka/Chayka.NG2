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

    @Input('validate-required') userConfig: ValidateRequiredConfigInterface = {};

    defaultConfig: ValidateRequiredConfigInterface = {
        message: 'validate-require-message',
        isActive: true,
    };

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

    constructor(protected nls: NlsService){
        super(nls);
        this.nls.extendDictionary('en-US', {
            'validate-require-message': 'This field is required',
        });
        this.nls.extendDictionary('ru-RU', {
            'validate-require-message': 'Данное поле обязательно для заполнения',
        });
    }

    validate(): boolean {
        return !this.config.isActive || !!this.getValue();
    }
}
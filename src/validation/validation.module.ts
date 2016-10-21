import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './form-field.component';
import { FormFieldRadioComponent } from './form-field-radio.component';
import { ValidateRequiredDirective } from './validate.required.directive';
import { ValidateLengthDirective } from './validate.length.directive';
import {
    ValidateRangeDirective,
    ValidateLeDirective, ValidateGeDirective,
    ValidateGtDirective, ValidateLtDirective
} from './validate.range.directive';
import { ValidateRegExpDirective, ValidateEmailDirective } from './validate.regexp.directive';
import { ValidatePasswordComplexityDirective, ValidatePasswordRepeatDirective } from './validate.password.dirctive';
import { ValidateCustomDirective, ValidateAsyncDirective, ValidateApiDirective } from './validate.custom.directive';
import { FormValidatorDirective } from './form-validator.directive';

/**
 * Provides form validation in the following format
 *
 * ```
 * <form-validator>
 *     <form-field [hint]="Digits only..." validateRequired [validateLength]="{min: 6, max: 5, if: needValidation}">
 *         <label>Some input</label>
 *         <input type="password" [(ngModel)]="userPass">
 *     <form-field>
 * </form-validator>
 * ```
 */
@NgModule({
    imports: [ CommonModule, FormsModule ],
    declarations: [
        FormValidatorDirective,
        FormFieldComponent,
        FormFieldRadioComponent,
        ValidateRequiredDirective,
        ValidateLengthDirective,
        ValidateRangeDirective,
        ValidateGeDirective,
        ValidateGtDirective,
        ValidateLeDirective,
        ValidateLtDirective,
        ValidateRegExpDirective,
        ValidateEmailDirective,
        ValidatePasswordComplexityDirective,
        ValidatePasswordRepeatDirective,
        ValidateCustomDirective,
        ValidateAsyncDirective,
        ValidateApiDirective,
    ],
    exports: [
        FormValidatorDirective,
        FormFieldComponent,
        FormFieldRadioComponent,
        ValidateRequiredDirective,
        ValidateLengthDirective,
        ValidateRangeDirective,
        ValidateGeDirective,
        ValidateGtDirective,
        ValidateLeDirective,
        ValidateLtDirective,
        ValidateRegExpDirective,
        ValidateEmailDirective,
        ValidatePasswordComplexityDirective,
        ValidatePasswordRepeatDirective,
        ValidateCustomDirective,
        ValidateAsyncDirective,
        ValidateApiDirective,
    ],
    providers: []
})
export class ValidationModule {

}
import { Component } from '@angular/core';
import { FormFieldComponent } from './form-field.component';
/**
 * Provides form validation in the following format
 *
 * ```
 * <form-validator>
 *     <form-field-radio [hint]="Digits only..." validateRequired [validateLength]="{min: 6, max: 5, if: needValidation}">
 *         <label class="field-label">Some input</label>
 *         <label><input type="radio" name="radion" value="1" [(ngModel)]="data.radio"/>text 1</label>
 *         <label><input type="radio" name="radion" value="2" [(ngModel)]="data.radio"/>text 2</label>
 *         <label><input type="radio" name="radion" value="3" [(ngModel)]="data.radio"/>text 3</label>
 *     <form-field-radio>
 * </form-validator>
 * ```
 */
@Component({
    selector: 'form-field-radio',
    template: require('./form-field-radio.component.html'),
    styles: [ require('./form-field.component.less'), require('./form-field-radio.component.less') ]
})
export class FormFieldRadioComponent extends FormFieldComponent {
}
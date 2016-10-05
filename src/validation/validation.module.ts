import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './form-field.component';
// import { ValidateAbstractDirective } from './validate.abstract.directive';
import { ValidateRequiredDirective } from './validate.required.directive';
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
        FormFieldComponent,
        // ValidateAbstractDirective,
        ValidateRequiredDirective
    ],
    exports: [
        FormFieldComponent,
        // ValidateAbstractDirective,
        ValidateRequiredDirective
    ],
    providers: []
})
export class ValidationModule {

}
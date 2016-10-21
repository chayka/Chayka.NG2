
import { Directive, ContentChildren, QueryList } from '@angular/core';
import { FormFieldComponent } from './form-field.component';

/**
 * Form validator is a container for form fields that can perform group validation
 * and show errors in corresponding fields.
 */
@Directive({
    selector: 'form-validator, [form-validator]',
    providers: [],
    exportAs: 'formValidator'
})
export class FormValidatorDirective {

    /**
     * Form fields contained  within form-validator
     */
    @ContentChildren(FormFieldComponent) fields: QueryList<FormFieldComponent>;

    /**
     * Validate all the fields that are contained
     *
     * @param {boolean} silent
     * @return {boolean}
     */
    validate(silent: boolean): boolean {
        let valid = true;
        this.fields.forEach((field: FormFieldComponent) => valid = field.validate(silent) && valid);
        return valid;
    }

    /**
     * Getter required to make it compatible with NgForm
     * @return {boolean}
     */
    get valid(): boolean {
        return this.validate(true);
    }

    /**
     * Show errors on the corresponding fields.
     *
     * @param messages
     */
    showErrors(messages: any): void {
        messages = Object.assign({}, messages);
        this.fields.forEach((field: FormFieldComponent) => {
            if(field.name && messages[field.name]){
                field.setState('invalid', messages[field.name]);
            }
        });

    }

}

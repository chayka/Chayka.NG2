import {
    Component, Input, ContentChild, ContentChildren, OnInit, QueryList,
    Renderer, ElementRef
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateRequiredDirective } from './validate.required.directive';
import { ValidateAbstractDirective } from './validate.abstract.directive';

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
@Component({
    selector: 'form-field',
    template: require('./form-field.component.html'),
    styles: [ require('./form-field.component.less') ]
})
export class FormFieldComponent implements OnInit {

    /**
     * Form field state:
     *  'clean' - untouched
     *  'valid' - form field value passes all active validations
     *  'invalid' - form field value fails at least one validation
     *  'progress' - form field async value validation is in progress
     *
     * @type {string}
     */
    state: string = 'clean';

    /**
     * Message that is shown below input
     *
     * @type {string}
     */
    message: string = '';

    @ContentChildren(NgModel) inputs: QueryList<NgModel>;

    /**
     * Hint that is shown below input while not in 'invalid' or 'progress' state
     * @type {string}
     */
    @Input() hint: string = '';

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

    /**
     * Get current input value, from [(ngModel)]
     *
     * @return {any|string}
     */
    get value(): any {
        return this.ngModel.value;
    }

    /**
     * ngOnInit should put all validations except 'required' here
     * @type {Array}
     */
    protected validations: ValidateAbstractDirective[] = [];

    @ContentChild(ValidateRequiredDirective) required : ValidateRequiredDirective;

    constructor(private el: ElementRef, private $: Renderer){
    }

    ngOnInit(): void {
        // this.validations.push()
        console.dir(this);
        if(this.ngModel){
            this.ngModel.update.subscribe((value: any) => {
                console.dir({value});
                setTimeout(() => this.validate(), 0);
                // this.validate();
            })
        }
    }

    setState(state: string, message: string = ''){
        this.state = state || 'clean';
        this.message = message;
    }

    performValidation(validation: ValidateAbstractDirective): boolean | null{
        let valid = validation.validate();
        switch(valid){
            case true:
                this.state = 'valid';
                this.message = '';
                break;
            case false:
                this.state = 'invalid';
                this.message = validation.getMessage('message');
                break;
            case null:
                this.state = 'progress';
                this.message = validation.getMessage('asyncMessage');
                break;
        }
        return valid;
    }

    validate(): boolean | null {
        let v = this.validations;
        let valid = !this.required || this.performValidation(this.required);
        let value = this.value;
        if(value && valid){
            Object.keys(v).forEach(key => {
                // if(valid){
                    valid = valid && this.performValidation(v[key]);
                // }
            });
        }
        return valid;
    }
}
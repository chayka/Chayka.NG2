import {
    Component, Input, ContentChild, ContentChildren, OnInit, QueryList,
    Renderer, ElementRef
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidateRequiredDirective } from './validate.required.directive';
import { ValidateAbstractDirective } from './validate.abstract.directive';
import { ValidateLengthDirective } from './validate.length.directive';
import {
    ValidateRangeDirective,
    ValidateGeDirective,
    ValidateGtDirective,
    ValidateLeDirective,
    ValidateLtDirective,
} from './validate.range.directive';
import {
    ValidateRegExpDirective,
    ValidateEmailDirective
} from './validate.regexp.directive';
import {
    ValidatePasswordComplexityDirective,
    ValidatePasswordRepeatDirective
} from './validate.password.dirctive';

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
     * ngOnInit should put all validations except 'vRequired' here
     * @type {Array}
     */
    protected validations: ValidateAbstractDirective[] = [];

    /**
     * Fetch validate-required
     */
    @ContentChild(ValidateRequiredDirective) vRequired : ValidateRequiredDirective;

    /**
     * Fetch validate-length
     */
    @ContentChild(ValidateLengthDirective) vLength : ValidateLengthDirective;

    /**
     * Fetch validate-range
     */
    @ContentChild(ValidateRangeDirective) vRange : ValidateRangeDirective;

    /**
     * Fetch validate-ge
     */
    @ContentChild(ValidateGeDirective) vGe : ValidateGeDirective;

    /**
     * Fetch validate-gt
     */
    @ContentChild(ValidateGtDirective) vGt : ValidateGtDirective;

    /**
     * Fetch validate-le
     */
    @ContentChild(ValidateLeDirective) vLe : ValidateLeDirective;

    /**
     * Fetch validate-lt
     */
    @ContentChild(ValidateLtDirective) vLt : ValidateLtDirective;

    /**
     * Fetch validate-regexp
     */
    @ContentChild(ValidateRegExpDirective) vRegExp : ValidateRegExpDirective;

    /**
     * Fetch validate-email
     */
    @ContentChild(ValidateEmailDirective) vEmail : ValidateEmailDirective;

    /**
     * Fetch validate-password-complexity
     */
    @ContentChild(ValidatePasswordComplexityDirective) vPasswordComplexity : ValidatePasswordComplexityDirective;

    /**
     * Fetch validate-password-repeat
     */
    @ContentChild(ValidatePasswordRepeatDirective) vPasswordRepeat : ValidatePasswordRepeatDirective;

    /**
     * Constructor
     *
     * @param el
     * @param $
     */
    constructor(private el: ElementRef, private $: Renderer){
    }

    /**
     * Setup validations and value watching.
     */
    ngOnInit(): void {
        // this.validations.push()
        console.dir(this);
        if(this.ngModel){
            this.ngModel.update.subscribe((value: any) => {
                console.dir({value});
                setTimeout(() => this.validate(), 0);
            })
        }
        if(this.vLength){
            this.validations.push(this.vLength);
        }
        if(this.vRange){
            this.validations.push(this.vRange);
        }
        if(this.vGe){
            this.validations.push(this.vGe);
        }
        if(this.vGt){
            this.validations.push(this.vGt);
        }
        if(this.vLe){
            this.validations.push(this.vLe);
        }
        if(this.vLt){
            this.validations.push(this.vLt);
        }
        if(this.vRegExp){
            this.validations.push(this.vRegExp);
        }
        if(this.vEmail){
            this.validations.push(this.vEmail);
        }
        if(this.vPasswordComplexity){
            this.validations.push(this.vPasswordComplexity);
        }
        if(this.vPasswordRepeat){
            this.validations.push(this.vPasswordRepeat);
        }
    }

    /**
     * Set form field state based on validation
     *
     * @param state
     * @param message
     */
    setState(state: string, message: string = ''){
        this.state = state || 'clean';
        this.message = message;
    }

    /**
     * Perform single validation and set appropriate field state
     *
     * @param validation
     * @return {boolean|null}
     */
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

    /**
     * Perform all validations
     *
     * @return {boolean|boolean|null}
     */
    validate(): boolean | null {
        let v = this.validations;
        let valid = !this.vRequired || this.performValidation(this.vRequired);
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
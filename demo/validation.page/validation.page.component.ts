import { Component } from '@angular/core';
import { AjaxService } from '../../src/ajax/ajax.service';
import { FormValidatorDirective } from '../../src/validation/form-validator.directive';
// import { SpinnerComponent } from '../../src/spinners/spinner.component';

@Component({
    template: require('./validation.page.component.html'),
    styles: [ require('./validation.page.component.less') ]
})
export class ValidationPageComponent {
    needValidation = true;

    data = {

    };


    constructor(protected ajax: AjaxService) {
    }

    validateCustom(value: any){
        return parseInt(value) === 1;
    }

    sendData(validator: FormValidatorDirective){
        console.dir({validator});
        this.ajax.get(this.ajax.buildGetQueryUrl('/api/form.error.json', this.data), {
            validate: this.needValidation,
            validator
        }).subscribe(data => data, err => console.log(err));
    }

}
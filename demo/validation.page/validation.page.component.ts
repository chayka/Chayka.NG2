import { Component } from '@angular/core';
// import { AjaxService } from '../../src/ajax/ajax.service';
// import { SpinnerComponent } from '../../src/spinners/spinner.component';

@Component({
    template: require('./validation.page.component.html'),
    styles: [ require('./validation.page.component.less') ]
})
export class ValidationPageComponent {
    needValidation = true;
    userPass='';
}
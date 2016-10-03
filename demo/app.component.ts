import { Component } from '@angular/core';
import { SpinnersService } from '../src/spinners/spinners.service';
import { ModalsService } from '../src/modals/modals.service';

@Component({
    selector: 'chayka-app',
    template: require('./app.component.html'),
})
export class AppComponent {

    constructor(
        public spinners: SpinnersService,
        public modals: ModalsService
    ){
        // let loading = this.spinners.show('Loading app...');
        // setTimeout(()=>{
        //     this.spinners.hide(loading);
        // }, 500);
    }
}
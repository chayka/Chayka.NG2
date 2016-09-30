import { Component } from '@angular/core';
import { SpinnersService } from '../src/spinners/spinners.service';

@Component({
    selector: 'chayka-app',
    template: require('./app.component.html'),
})
export class AppComponent {

    spinners: SpinnersService;

    constructor(
        spinners: SpinnersService
    ){
        // let loading = this.spinners.show('Loading app...');
        // setTimeout(()=>{
        //     this.spinners.hide(loading);
        // }, 500);
    }
}
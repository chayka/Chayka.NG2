import { Component } from '@angular/core';
import { SpinnersService } from '../../src/spinners/spinners.service'

@Component({
    template: require('./spinners.page.component.html'),
    styles: [require('./spinners.page.component.less')]
})
export class SpinnersPageComponent{

    generalSpinners: string[] = [];

    spinners: SpinnersService;

    constructor(spinners: SpinnersService){
        this.spinners = spinners;
    }

    addGeneralSpinner(){
        let text = [
            'Loading Posts...',
            'Loading Users...',
            'Loading Comments...'
        ];
        let randIndex = Math.floor(Math.random() * text.length);
        this.generalSpinners.push(this.spinners.show(text[randIndex]));
    }

    removeGeneralSpinner(){
        let id = this.generalSpinners.shift();
        if(id){
            this.spinners.hide(id);
        }
    }
}
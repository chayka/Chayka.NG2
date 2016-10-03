import {Component} from '@angular/core';
import {ModalsService} from '../../src/modals/modals.service';
@Component({
    template: require('./modals.page.component.html'),
    styles: [require('./modals.page.component.less')]
})
export class ModalsPageComponent{

    constructor(public modals: ModalsService){
        setInterval(() => {
            // console.log(`queue length: ${modals.queue.length}`);
        }, 1000)
    }

    modalClosed(payload: any){
        console.dir({onClose: payload});
    }

    showAlert(){
        this.modals.alert('Nasty alert message', 'Alarma!', ()=>{console.log('alert happened!')});
    }

    show2Alerts(){
        this.modals.alert('Nasty alert 1', 'Alarma!');
        this.modals.alert('Nasty alert 2', 'Alarma!');
    }

    showConfirm(){
        this.modals.confirm('Are you sure you are a human?\nThink twice...', 'Human detection...', ()=>{
            this.modals.alert('Kill all humans!!!');
        })
    }
}
import {Component} from '@angular/core';
import {NlsService} from '../../src/nls/nls.service';
@Component({
    template: require('./nls.page.component.html'),
    styles: [require('./nls.page.component.less')]
})
export class NlsPageComponent{

    locale = 'en-US';

    constructor(public nls: NlsService){

    }
}
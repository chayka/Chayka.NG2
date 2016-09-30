import { NgModule } from '@angular/core';
import { NlsPipe } from './nls.pipe';
import { NlsService } from "./nls.service";

@NgModule({
    declarations: [NlsPipe],
    exports: [NlsPipe],
    providers: [NlsService]
})
export class NlsModule {}
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { GeneralSpinnerComponent } from './general-spinner.component';
import { SpinnersService } from "./spinners.service";

@NgModule({
    imports: [CommonModule],
    declarations: [SpinnerComponent, GeneralSpinnerComponent],
    exports: [SpinnerComponent, GeneralSpinnerComponent],
    providers: [SpinnersService]
})
export class SpinnersModule {}
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdditionalComponent} from './additional.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdditionalControlsComponent } from './components/additional-controls/additional-controls.component';
import { AdditionalTableComponent } from './components/additional-table/additional-table.component';
import {AdditionalService} from './services/additional.service';
import { AdditionalParticipantComponent } from './popups/additional-participant/additional-participant.component';
import { AdditionalCodeComponent } from './popups/additional-code/additional-code.component';
import { AdditionalResultPipe } from './pipes/additional-result.pipe';


@NgModule({
    declarations: [AdditionalComponent, AdditionalControlsComponent, AdditionalTableComponent, AdditionalParticipantComponent, AdditionalCodeComponent, AdditionalResultPipe],
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: '',
            component: AdditionalComponent,
        }]),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [AdditionalService],
})
export class AdditionalModule {
}

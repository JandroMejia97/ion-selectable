import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { IonSelectableModule } from '@ion-selectable/ion-selectable.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonSelectableModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MateriaPageRoutingModule } from './materia-routing.module';

import { MateriaPage } from './materia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MateriaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MateriaPage]
})
export class MateriaPageModule {}

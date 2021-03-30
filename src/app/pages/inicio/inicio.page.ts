import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Materia } from 'src/app/interfaces/materia';
import { MateriaService } from 'src/app/services/materia.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, AfterViewInit {

  constructor(private alertController: AlertController, public materiService: MateriaService) { }

  materias: Materia[] = [];

  ngOnInit() { this.consultarMaterias(); }

  onClick(id: number){
    this.materiService.guardarId(id);
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Agregar meteria',
      inputs: [
        {
          name: 'profesor',
          type: 'text',
          placeholder: 'Profesor'
        },
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'nota1',
          type: 'number',
          placeholder: 'Primer corte',
          min: 0,
          max: 5
        },
        {
          name: 'nota2',
          type: 'number',
          placeholder: 'Segundo corte',
          min: 0,
          max: 5
        },
        {
          name: 'nota3',
          type: 'number',
          placeholder: 'Tercer corte',
          min: 0,
          max: 5,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Guardar',
          handler: ( materia: Materia ) => {
            this.materiService.post(materia);
            this.consultarMaterias();
          }
        }
      ]
    });

    await alert.present();
  }

  consultarMaterias() {
    this.materias = this.materiService.consultarAll();
  }

  ngAfterViewInit(){
    this.consultarMaterias();
  }
}

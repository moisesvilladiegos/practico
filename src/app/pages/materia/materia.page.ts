import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Materia } from 'src/app/interfaces/materia';
import { MateriaService } from 'src/app/services/materia.service';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.page.html',
  styleUrls: ['./materia.page.scss'],
})
export class MateriaPage implements OnInit {

  constructor( private materiaService: MateriaService, private formBuilder: FormBuilder, private navController: NavController) { }

  formGroup: FormGroup;
  materia: Materia;

  ngOnInit() {
    this.buildForm();
    this.mapearMateria();
  }

  private buildForm(){
    this.materia = new Materia();
    this.materia.profesor = '';
    this.materia.nombre = '';
    this.materia.nota1 = 0;
    this.materia.nota2 = 0;
    this.materia.nota3 = 0;

    this.formGroup = this.formBuilder.group({
      profesor: [this.materia.profesor, Validators.required],
      nombre: [this.materia.nombre, Validators.required],
      nota1: [this.materia.nota1, [Validators.required, Validators.maxLength(3), Validators.minLength(1)]],
      nota2: [this.materia.nota2, [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      nota3: [this.materia.nota3, [Validators.required, Validators.minLength(1), Validators.maxLength(1)]]
    });
  }

  onSubmit(){
    if (this.formGroup.invalid){
      return;
    }
    this.guardar();
  }

  get control(){
    return this.formGroup.controls;
  }

  guardar(){
    const id = this.materia.id;
    this.materia = this.formGroup.value;
    this.materia.id = id;
    this.materiaService.put(this.materia);
    this.navController.back();
  }

  mapearMateria(){
    this.materia = this.materiaService.buscar();
    this.formGroup.setValue({
      profesor: this.materia.profesor,
      nombre: this.materia.nombre,
      nota1: this.materia.nota1,
      nota2: this.materia.nota2,
      nota3: this.materia.nota3
    });
  }

  eliminar(){
    this.materiaService.delete(this.materia.id);
    this.navController.back();
  }
}

import { Injectable } from '@angular/core';
import { Materia } from '../interfaces/materia';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  id = 0;
  public materias: Materia[] = [];
  sqlObject: SQLiteObject;

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.crearDB();
  }

  crearDB() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default',
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS materias (id INTEGER PRIMARY KEY, profesor TEXT, nombre TEXT, nota1 REAL, nota2 REAL, nota3 REAL, def REAL)', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
        this.sqlObject = db;
        this.gets(db);
        this.consultarAll();
      })
        .catch(e => console.log(e));
    });
  }

  guardarId(id: number){
    this.id = id;
  }

  gets(sqlObject: SQLiteObject) {
    this.materias = [];
    return sqlObject.executeSql('SELECT * FROM materias ORDER BY nombre ASC', []).then((r) => {
      if (r.rows.length > 0) {
        for (let i = 0; i < r.rows.length; i++) {
          this.materias.push({
            id: r.rows.item(i).id,
            profesor: r.rows.item(i).profesor,
            nombre: r.rows.item(i).nombre,
            nota1: r.rows.item(i).nota1,
            nota2: r.rows.item(i).nota2,
            nota3: r.rows.item(i).nota3,
            definitiva: r.rows.item(i).def
          });
        }
      }
    });
  }

  consultarAll(): Materia[] {
    return this.materias;
  }

  post(materia: Materia){
    const id = this.generarCodigo();
    const def = this.calcularDefinitiva(materia.nota1, materia.nota2, materia.nota3);
    const datos = [id, materia.profesor, materia.nombre, materia.nota1, materia.nota2, materia.nota3, def];

    return this.sqlObject.executeSql('INSERT INTO materias (id,profesor,nombre,nota1,nota2,nota3,def) VALUES (?,?,?,?,?,?,?)', datos)
    .then( data => {
      this.gets(this.sqlObject);
    });
  }

  calcularDefinitiva(nota1: number, nota2: number, nota3: number){
    return (Number(nota1) + Number(nota2) + Number(nota3)) / 3;
  }

  buscar(): Materia{
    let materiaLocal;
    this.materias.forEach( materia => {
      if ( materia.id === this.id ){
        materiaLocal = materia;
      }
    });
    return materiaLocal;
  }

  generarCodigo(){
    const max = 100;
    const min = 1;
    return Math.round(Math.random() * (max - min) + min);
  }

  delete(id){
    this.sqlObject.transaction( p => {
      p.executeSql(`DELETE FROM materias WHERE id = ${id}`);
    }).then( r => {
      this.gets(this.sqlObject);
    });
  }

  put(materia: Materia){
    const def = this.calcularDefinitiva(materia.nota1, materia.nota2, materia.nota3);
    const datos = [materia.profesor, materia.nombre, materia.nota1, materia.nota2, materia.nota3, def];

    this.sqlObject.transaction((p) => {
      p.executeSql(`UPDATE materias SET profesor=?, nombre=?, nota1=?, nota2=?, nota3=?, def=? WHERE id=${materia.id}`, datos);
    }).then(data => {
      this.gets(this.sqlObject);
    });
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private coleccionOperadores: AngularFirestoreCollection<any>;
  public operadores: Observable<any[]>;
  imagenes: any[] = [];
  public nroOperadores = 0;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    const nombreEmpresa = JSON.parse(localStorage.getItem('userInfo'))
      .nombreEmpresa;

    this.getOperadores(nombreEmpresa);
  }

  getOperadores(empresa: string) {
    this.coleccionOperadores = this.firestore.collection<any>(
      'usuario',
      (ref) => ref.where('cargo', '==', 'Administrador')
      // .where('nombreEmpresa', '==', empresa)
    );

    this.operadores = this.coleccionOperadores.valueChanges();

    this.operadores.subscribe((lista) => {
      this.nroOperadores = lista.length;
      console.log(lista);
      this.getImagenes(lista);
    });
  }

  async getImagenes(operadores) {
    for await (const operador of operadores) {
      const url = await this.storage
        .ref(`imgPerfil-${operador.id}`)
        .getDownloadURL()
        .toPromise();

      this.imagenes.push(url);
    }
  }

  agregarOperador(operador) {
    this.coleccionOperadores.add(operador);
  }
}

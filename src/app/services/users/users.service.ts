import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { AngularFireStorage } from '@angular/fire/storage';
import Operador from '../interfaces/operador';
import Respuesta from '../interfaces/respuesta';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private coleccionOperadores: AngularFirestoreCollection<any>;
  operadores: Observable<any[]>;
  imagenes: any[] = [];
  nroOperadores = 0;
  imagenPerfil: string;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    this.getOperadores(userInfo.nombreEmpresa);

    this.getImagenPerfil(userInfo.id);
  }

  async getImagenPerfil(userId) {
    this.imagenPerfil = await this.getImagen(userId);
  }

  getOperadores(empresa: string) {
    this.coleccionOperadores = this.firestore.collection<any>(
      'usuario',
      (ref) =>
        ref
          .where('cargo', '==', 'Operador')
          .where('nombreEmpresa', '==', empresa)
    );

    this.operadores = this.coleccionOperadores.valueChanges();

    this.operadores.subscribe((lista) => {
      this.nroOperadores = lista.length;
      this.getImagenes(lista);
    });
  }

  async getImagenes(operadores) {
    for await (const operador of operadores) {
      const url = await this.getImagen(operador.id);
      this.imagenes.push(url);
    }
  }

  async getImagen(idOperador) {
    const url = await this.storage
      .ref(`imgPerfil-${idOperador}`)
      .getDownloadURL()
      .toPromise();

    return url;
  }

  async crearCuestionario(schema): Promise<Respuesta> {
    try {
      const respuestaDoc = await this.firestore
        .collection('cuestionario')
        .add(schema);

      return { exito: true, contenido: respuestaDoc };
    } catch (error) {
      return { exito: false, contenido: error };
    }
  }

  async getCuestionarios(idOperador: string): Promise<Respuesta> {
    const respuesta = await this.firestore
      .collection('cuestionario', (ref) => ref.where('id', '==', idOperador))
      .get()
      .toPromise();

    return { exito: true, contenido: respuesta };
  }
}

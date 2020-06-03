import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import Respuesta from '../interfaces/respuesta';
import Operador from '../interfaces/operador';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage
  ) {}

  async crearUsuarioEnFb(correo: string, clave: string): Promise<Respuesta> {
    try {
      const respuestaAuth = await this.auth.createUserWithEmailAndPassword(
        correo,
        clave
      );

      return { exito: true, contenido: respuestaAuth };
    } catch (error) {
      return { exito: false, contenido: error };
    }
  }

  async registrarOperador(informacion: Operador) {
    const originalUser = await this.auth.currentUser;
    let respuesta = await this.crearUsuarioEnFb(
      informacion.correo,
      informacion.clave
    );

    const userId = respuesta.contenido.user.uid;

    if (!respuesta.exito) {
      return respuesta;
    }

    respuesta = await this.crearDocOperador(informacion, userId);

    if (!respuesta.exito) {
      return respuesta;
    }

    respuesta = await this.subirImagen(informacion.imagen, userId);

    this.auth.updateCurrentUser(originalUser);
    return respuesta;
  }

  async crearDocOperador(
    informacion: Operador,
    id: string
  ): Promise<Respuesta> {
    try {
      const respuestaDoc = await this.firestore
        .collection<Operador>('usuario')
        .add({
          primerNombre: informacion.primerNombre,
          apellido: informacion.apellido,
          direccion: informacion.direccion,
          correo: informacion.correo,
          nombreEmpresa: informacion.nombreEmpresa,
          id,
          cargo: 'Operador',
          habilitado: true,
        });

      return { exito: true, contenido: respuestaDoc };
    } catch (error) {
      return { exito: false, contenido: error };
    }
  }

  async subirImagen(imagen: File, id: string): Promise<Respuesta> {
    try {
      const respuestaImg = await this.storage
        .ref(`/imgPerfil-${id}`)
        .put(imagen);

      return { exito: true, contenido: respuestaImg };
    } catch (error) {
      return { exito: false, contenido: error };
    }
  }
}

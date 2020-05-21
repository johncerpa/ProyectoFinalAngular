import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Admin from '../interfaces/admin';
import Operador from '../interfaces/operador';
import Respuesta from '../interfaces/respuesta';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userAuth: any;
  userInfo: any;

  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
    public storage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userAuth = user;
        localStorage.setItem('user', JSON.stringify(this.userAuth));

        this.informacionPerfil(user.uid).subscribe((value) => {
          this.userInfo = value[0];
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        });

        this.router.navigate(['home']);
      } else {
        this.userAuth = null;
      }
    });
  }

  async ingresar(email, password): Promise<Respuesta> {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((resultado) => {
        return { exito: true, contenido: resultado };
      })
      .catch((error) => {
        return { exito: false, contenido: error };
      });
  }

  async registrarOperador(informacion: Operador) {
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

    return respuesta;
  }

  async registrarAdmin(informacion: Admin): Promise<Respuesta> {
    let respuesta = await this.crearUsuarioEnFb(
      informacion.correo,
      informacion.clave
    );

    const userId = respuesta.contenido.user.uid;

    if (!respuesta.exito) {
      return respuesta;
    }

    respuesta = await this.crearDocAdmin(informacion, userId);

    if (!respuesta.exito) {
      return respuesta;
    }

    respuesta = await this.subirImagen(informacion.imagen, userId);

    return respuesta;
  }

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

  async crearDocAdmin(informacion: Admin, id: string): Promise<Respuesta> {
    try {
      const respuestaDoc = await this.firestore
        .collection<Admin>('usuario')
        .add({
          primerNombre: informacion.primerNombre,
          apellido: informacion.apellido,
          nombreEmpresa: informacion.nombreEmpresa,
          tipoDocumento: informacion.tipoDocumento,
          numeroDocumento: informacion.numeroDocumento,
          correo: informacion.correo,
          telefono: informacion.telefono,
          id,
          cargo: 'Administrador',
        });

      return { exito: true, contenido: respuestaDoc };
    } catch (error) {
      return { exito: false, contenido: error };
    }
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

  estaLogueado(): boolean {
    return !!localStorage.getItem('user');
  }

  informacionPerfil(id: string): Observable<any[]> {
    return this.firestore
      .collection('usuario', (ref) => ref.where('id', '==', id))
      .valueChanges();
  }

  salir() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['ingreso']);
    });
  }
}

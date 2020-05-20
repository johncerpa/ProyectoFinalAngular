import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Admin from '../interfaces/admin';
import Respuesta from '../interfaces/respuesta';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
    public storage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));

        this.informacionPerfil(user.uid).subscribe((value) => {
          const userLogged = value[0];
          localStorage.setItem('nombreEmpresa', userLogged.nombreEmpresa);
        });
      } else {
        this.userData = null;
        localStorage.removeItem('user');
      }
    });
  }

  async ingresar(email, password) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  async registrarOperador(informacion: Admin) {
    return this.auth
      .createUserWithEmailAndPassword(informacion.correo, informacion.clave)
      .then((result) => {})
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  async registrarAdmin(informacion: Admin): Promise<Respuesta> {
    let respuesta = await this.crearUsuarioEnFb(
      informacion.correo,
      informacion.clave
    );

    if (!respuesta.exito) {
      return respuesta;
    }

    respuesta = await this.crearDocAdmin(
      informacion,
      respuesta.contenido.user.uid
    );

    if (!respuesta.exito) {
      return respuesta;
    }

    respuesta = await this.subirImagen(
      respuesta.contenido.id,
      informacion.imagen
    );

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

  async subirImagen(id: string, imagen: File): Promise<Respuesta> {
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
      this.router.navigate(['/ingreso']);
    });
  }
}

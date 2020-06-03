import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Admin from '../interfaces/admin';
import Operador from '../interfaces/operador';
import Respuesta from '../interfaces/respuesta';
import Swal from 'sweetalert2';

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
    this.auth.authState.subscribe(async (user) => {
      if (user) {
        this.userAuth = user;
        localStorage.setItem('user', JSON.stringify(this.userAuth));

        this.informacionPerfil(user.uid).subscribe((value) => {
          this.userInfo = value[0];
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        });

        const respuestaTipo = await this.getTipoOperador(user.uid);
        const estaHabilitado = await this.comprobarHabilitado(user.uid);

        if (!estaHabilitado) {
          Swal.fire({
            title: 'Error!',
            text: 'Este usuario está deshabilitado',
            icon: 'error',
            onClose: () => this.salir(),
          });
        }

        if (router.url === '/ingreso') {
          if (respuestaTipo.contenido === 'Administrador') {
            this.router.navigate(['home']);
          } else {
            this.router.navigate(['homeOperador']);
          }
        }
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

  async registrarAdmin(informacion: Admin): Promise<Respuesta> {
    let respuesta = await this.crearUsuarioEnFb(
      informacion.correo,
      informacion.clave
    );

    if (!respuesta.exito) {
      return respuesta;
    }

    const userId = respuesta.contenido.user.uid;

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

  estaLogueado(): boolean {
    return !!localStorage.getItem('user');
  }

  informacionPerfil(id: string): Observable<any[]> {
    return this.firestore
      .collection('usuario', (ref) => ref.where('id', '==', id))
      .valueChanges();
  }

  async getTipoOperador(id: string): Promise<Respuesta> {
    try {
      const respuesta = await this.firestore
        .collection('usuario', (ref) => ref.where('id', '==', id))
        .get()
        .toPromise();
      return { exito: true, contenido: respuesta.docs[0].data().cargo };
    } catch (error) {
      return { exito: false, contenido: error };
    }
  }

  async comprobarHabilitado(idOperador) {
    const respuesta = await this.firestore
      .collection('usuario', (ref) =>
        ref.where('id', '==', idOperador).where('habilitado', '==', true)
      )
      .get()
      .toPromise();

    return respuesta.docs.length > 0;
  }

  async cambiarHabilitado(idOperador: string): Promise<Respuesta> {
    const respuesta = await this.firestore
      .collection('usuario', (ref) => ref.where('id', '==', idOperador))
      .get()
      .toPromise();

    if (respuesta.docs.length > 0) {
      const doc = respuesta.docs[0];

      const updateDoc = await this.firestore
        .doc(`usuario/${doc.id}`)
        .get()
        .toPromise();

      if (updateDoc.data().habilitado) {
        updateDoc.ref.update({ habilitado: false });
        return { exito: true, contenido: 'El usuario ha sido deshabilitado' };
      } else {
        updateDoc.ref.update({ habilitado: true });
        return { exito: true, contenido: 'El usuario ha sido habilitado' };
      }
    }
  }

  async actualizarOperador(
    idOperador: string,
    informacion
  ): Promise<Respuesta> {
    const respuesta = await this.firestore
      .collection('usuario', (ref) => ref.where('id', '==', idOperador))
      .get()
      .toPromise();

    if (respuesta.docs.length > 0) {
      const doc = respuesta.docs[0];

      const updateDoc = await this.firestore
        .doc(`usuario/${doc.id}`)
        .get()
        .toPromise();

      try {
        await updateDoc.ref.update(informacion);
        return { exito: true, contenido: 'El usuario ha sido deshabilitado' };
      } catch (error) {
        return { exito: false, contenido: error };
      }
    }
  }

  async cambiarClave(correo: string): Promise<Respuesta> {
    return this.auth
      .sendPasswordResetEmail(correo)
      .then(() => {
        return {
          exito: true,
          contenido:
            'El correo ha sido enviado con éxito, puedes revisar tu bandeja y cambiar tu contraseña',
        };
      })
      .catch((error) => {
        return {
          exito: false,
          contenido: `No se ha podido enviar el correo, intentalo nuevamente. ${error.code}, ${error.message}`,
        };
      });
  }

  salir() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['ingreso']);
    });
  }
}

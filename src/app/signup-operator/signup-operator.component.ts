import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import Operador from '../services/interfaces/operador';
import { validarOperador } from '../services/utils/validar';
import Swal from 'sweetalert2';
import Respuesta from '../services/interfaces/respuesta';

@Component({
  selector: 'app-signup-operator',
  templateUrl: './signup-operator.component.html',
  styleUrls: ['./signup-operator.component.css'],
})
export class SignupOperatorComponent implements OnInit {
  // Entrada
  primerNombre = '';
  apellido = '';
  direccion = '';
  imagen: File;
  correo = '';
  clave = '';

  // Vista
  mostrarSpinner = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _location: Location
  ) {}

  back() {
    this._location.back();
  }

  ngOnInit(): void {}

  async registrar() {
    this.mostrarSpinner = true;

    const informacion: Operador = {
      primerNombre: this.primerNombre,
      apellido: this.apellido,
      nombreEmpresa: this.authService.userInfo.nombreEmpresa,
      direccion: this.direccion,
      imagen: this.imagen,
      correo: this.correo,
      clave: this.clave,
      cargo: 'Operador',
    };

    const { valido, problema } = validarOperador(informacion);

    if (!valido) {
      Swal.fire({
        title: 'Error!',
        text: problema,
        icon: 'error',
      });
      this.mostrarSpinner = false;
      return;
    }

    const respuesta: Respuesta = await this.authService.registrarOperador(
      informacion
    );

    if (!respuesta.exito) {
      if (respuesta.contenido.code === 'auth/email-already-in-use') {
        respuesta.contenido.message =
          'Este correo ya es usado por otro usuario';
      }

      Swal.fire({
        title: 'Error!',
        text: `Ocurrió un error al registrar. ${respuesta.contenido.message}`,
        icon: 'error',
      });

      this.mostrarSpinner = false;
      return;
    }

    Swal.fire({
      title: 'Exito!',
      text: 'El usuario ha sido registrado',
      icon: 'success',
      onClose: () => this.router.navigate(['home']),
    });
  }

  obtenerImg(imagenInput: any) {
    this.imagen = imagenInput.files[0];
  }
}

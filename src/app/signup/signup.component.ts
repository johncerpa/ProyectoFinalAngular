import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import Respuesta from '../services/interfaces/respuesta';
import Swal from 'sweetalert2';
import { validarAdmin } from '../services/utils/validar';
import Admin from '../services/interfaces/admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  // Entrada
  primerNombre = '';
  apellido = '';
  numeroDocumento = '';
  telefono = '';
  nombreEmpresa = '';
  imagen: File;
  correo = '';
  clave = '';

  // Vista
  mostrarSpinner = false;

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    this.mostrarSpinner = true;

    const informacion: Admin = {
      primerNombre: this.primerNombre,
      apellido: this.apellido,
      tipoDocumento: this.obtenerTipo(),
      numeroDocumento: this.numeroDocumento,
      telefono: this.telefono,
      nombreEmpresa: this.nombreEmpresa,
      imagen: this.imagen,
      correo: this.correo,
      clave: this.clave,
    };

    const { valido, problema } = validarAdmin(informacion);

    if (!valido) {
      Swal.fire({
        title: 'Error!',
        text: problema,
        icon: 'error',
      });
      this.mostrarSpinner = false;
      return;
    }

    const respuesta: Respuesta = await this.authService.registrarAdmin(
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

  obtenerTipo() {
    const tipo = document.querySelector(
      'input[name="tipo"]:checked'
    ) as HTMLInputElement;

    if (!tipo) {
      return '';
    }

    return tipo.value;
  }

  ngOnInit(): void {}
}

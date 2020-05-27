import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent {
  mostrarSpinner = false;

  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  back() {
    this.location.back();
  }

  async cambiarClave(correo: string) {
    this.mostrarSpinner = true;

    const respuesta = await this.authService.cambiarClave(correo);

    if (!respuesta.exito) {
      Swal.fire({ title: 'Error!', text: respuesta.contenido, icon: 'error' });
      this.mostrarSpinner = false;
      return;
    }

    Swal.fire({
      title: 'Éxito!',
      text: respuesta.contenido,
      icon: 'success',
      onClose: () => this.router.navigate(['/home']),
    });
  }
}

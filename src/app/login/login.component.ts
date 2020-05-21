import {
  Component,
  OnInit,
  ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__,
} from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  correo = '';
  clave = '';

  constructor(public authService: AuthService, private router: Router) {}

  async ingresar() {
    const respuesta = await this.authService.ingresar(this.correo, this.clave);

    if (!respuesta.exito) {
      let mensaje = '';

      if (respuesta.contenido.code === 'auth/wrong-password') {
        mensaje = 'La contraseña no es valida';
      }

      if (respuesta.contenido.code === 'auth/invalid-email') {
        mensaje = 'El correo electrónico está mal escrito';
      }

      Swal.fire({
        title: 'Error!',
        text: `Ocurrió un error al ingresar. ${mensaje}`,
        icon: 'error',
      });

      return;
    }
  }

  ngOnInit(): void {}
}

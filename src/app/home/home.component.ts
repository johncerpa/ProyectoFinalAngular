import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users/users.service';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  mostrarSpinner = false;

  constructor(
    public usersService: UsersService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async cambiarHabilitado(idOperador: string) {
    const respuesta = await this.authService.cambiarHabilitado(idOperador);

    if (!respuesta.exito) {
      Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un problema al cambiar el estado',
        icon: 'error',
      });
    }

    Swal.fire({ title: 'Exito', text: respuesta.contenido, icon: 'success' });
  }

  creatCuestionario(idOperador: string) {
    this.router.navigate(['cuestionario', idOperador]);
  }
}

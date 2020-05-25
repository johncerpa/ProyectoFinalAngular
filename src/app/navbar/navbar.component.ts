import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  primeraVez = true;
  nroNotifs = 0;
  notificaciones = [];

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const nombreEmpresa = JSON.parse(localStorage.getItem('userInfo'))
      .nombreEmpresa;

    this.usersService
      .cuestionariosUpdates(nombreEmpresa)
      .subscribe((changes) => {
        changes.forEach((change) => {
          console.log(change);
          if (this.primeraVez) {
            this.primeraVez = false;
          } else {
            if (change.type === 'added') {
              this.notificaciones.push({
                fecha: this.obtenerFechaYHora(),
                mensaje: 'Se creó un cuestionario',
              });
              this.nroNotifs++;
            }
            if (change.type === 'modified') {
              this.notificaciones.push({
                fecha: this.obtenerFechaYHora(),
                mensaje: 'Se modificó un cuestionario',
              });
              this.nroNotifs++;
            }
          }
        });
      });
  }

  mostrarNotificaciones() {
    if (this.nroNotifs > 0) {
      let text = '<ul>';

      this.notificaciones.forEach((n) => {
        text += `<li>${n.mensaje} <small class="text-muted">${n.fecha}</small></li>`;
      });

      text += '</ul>';

      Swal.fire({
        title: 'Notificaciones',
        html: text,
        icon: 'info',
      });
      this.nroNotifs = 0;
    } else {
      Swal.fire({
        title: 'Notificaciones',
        html: 'No hay notificaciones',
        icon: 'info',
      });
    }
  }

  salir() {
    this.authService.salir();
  }

  obtenerFechaYHora() {
    const fechaActual = new Date();
    return (
      fechaActual.getDate() +
      '/' +
      (fechaActual.getMonth() + 1) +
      '/' +
      fechaActual.getFullYear() +
      ' @ ' +
      fechaActual.getHours() +
      ':' +
      fechaActual.getMinutes() +
      ':' +
      fechaActual.getSeconds()
    );
  }
}

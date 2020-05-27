import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  mostrarSpinner = false;
  primerNombre = '';
  apellido = '';
  direccion = '';

  constructor(
    private authService: AuthService,
    private activRoute: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) {}

  back() {
    this._location.back();
  }

  ngOnInit(): void {}

  async actualizarOperador() {
    const idOperador = this.activRoute.snapshot.paramMap.get('idOperador');

    const informacion = {};

    if (this.primerNombre.length !== 0) {
      informacion['primerNombre'] = this.primerNombre;
    }

    if (this.apellido.length !== 0) {
      informacion['apellido'] = this.primerNombre;
    }

    if (this.direccion.length !== 0) {
      informacion['direccion'] = this.direccion;
    }

    const respuesta = await this.authService.actualizarOperador(
      idOperador,
      informacion
    );

    if (!respuesta.exito) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo actualizar el operador',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: 'Exito!',
      text: 'Operador actualizado',
      icon: 'success',
      onClose: () => this.router.navigate(['/home']),
    });
  }
}

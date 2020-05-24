import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-cuestionarios',
  templateUrl: './ver-cuestionarios.component.html',
  styleUrls: ['./ver-cuestionarios.component.css'],
})
export class VerCuestionariosComponent implements OnInit {
  idOperador: string;
  cuestionarios = [];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private activRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idOperador = this.activRoute.snapshot.paramMap.get('idOperador');

    this.getCuestionarios();
  }

  async getCuestionarios() {
    const respuesta = await this.usersService.getCuestionarios(this.idOperador);

    const docs = respuesta.contenido.docs;

    docs.forEach((doc) => {
      this.cuestionarios.push(doc.data());
    });

    if (this.cuestionarios.length === 0) {
      Swal.fire({
        title: 'Vacio!',
        text: 'Este usuario no tiene cuestionarios disponibles',
        icon: 'info',
        onClose: () => this.router.navigate(['home']),
      });
    }
  }
}

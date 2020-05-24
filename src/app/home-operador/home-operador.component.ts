import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from '../services/users/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home-operador',
  templateUrl: './home-operador.component.html',
  styleUrls: ['./home-operador.component.css'],
})
export class HomeOperadorComponent implements OnInit {
  idOperador: string;
  cuestionarios = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.idOperador = JSON.parse(localStorage.getItem('userInfo')).id;

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
      });
    }
  }
}

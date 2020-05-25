import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from '../services/users/users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  getPreguntasRespuestas() {
    const preguntas = [];

    for (let i = 1; i <= 5; i++) {
      const pregunta = document.getElementById(
        `pregunta${i}`
      ) as HTMLInputElement;
      preguntas[i - 1] = pregunta.value;

      if (!preguntas[i - 1]) {
        Swal.fire({
          title: 'Error!',
          text: 'Las preguntas no pueden estar vacias.',
          icon: 'error',
        });
        return;
      }
    }

    const respuestas = [];
    for (let i = 1; i <= 5; i++) {
      respuestas[i - 1] = [];
      for (let j = 1; j <= 3; j++) {
        const respuesta = document.getElementById(
          `respuesta${i}${j}`
        ) as HTMLInputElement;

        respuestas[i - 1][j - 1] = respuesta.value;

        if (!respuestas[i - 1][j - 1]) {
          Swal.fire({
            title: 'Error!',
            text: 'Las respuestas no pueden estar vacias.',
            icon: 'error',
          });
          return;
        }
      }
    }

    const vals = [];
    for (let i = 1; i <= 5; i++) {
      vals[i - 1] = [];
      for (let j = 1; j <= 3; j++) {
        const valor = document.getElementById(
          `valor${i}${j}`
        ) as HTMLInputElement;

        vals[i - 1][j - 1] = valor.value;
      }
    }

    return { preguntas, respuestas, vals };
  }

  async crearCuestionario() {
    const { preguntas, respuestas, vals } = this.getPreguntasRespuestas();

    const objs = [];
    for (let i = 0; i < 5; i++) {
      objs[i] = {
        texto: preguntas[i],
      };
    }

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        objs[i] = {
          [`respuesta${j + 1}`]: {
            texto: respuestas[i][j],
            seleccionada: false,
            valor: vals[i][j],
          },
          ...objs[i],
        };
      }
    }

    const schema = {
      id: this.route.snapshot.paramMap.get('idOperador'),
      terminada: false,
      nombreEmpresa: JSON.parse(localStorage.getItem('userInfo')).nombreEmpresa,
      preguntas: [objs[0], objs[1], objs[2], objs[3], objs[4]],
    };

    const respuesta = await this.usersService.crearCuestionario(schema);

    if (!respuesta.exito) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo crear el cuestionario',
        icon: 'error',
      });

      return;
    }

    Swal.fire({
      title: 'Exito!',
      text: 'Se ha creado el cuestionario!',
      icon: 'success',
      onClose: () => this.router.navigate(['home']),
    });
  }
}

import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

interface PregResp {
  respuesta: number;
  pregunta: number;
}

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css'],
})
export class CuestionarioComponent implements OnInit {
  @Input() cuestionario;
  @Input() idxCuestionario;

  @ViewChild('myCanvas')
  myCanvas: ElementRef;

  respuestas = [];
  valores = [];

  constructor(private usersService: UsersService, public router: Router) {}

  ngOnInit(): void {}

  async enviarRespuestas(docId: string) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < 5; i++) {
      if (!this.respuestas[i]) {
        Swal.fire({
          title: 'Error!',
          text: 'Debe responder todas las preguntas',
          icon: 'error',
        });
        return;
      }
    }

    const respuesta = await this.usersService.responderCuestionario(
      docId,
      this.respuestas
    );

    if (!respuesta.exito) {
      console.log('No se pudo responder');
      return;
    }

    Swal.fire({
      title: 'Exito!',
      text: 'Cuestionario respondido',
      icon: 'success',
      onClose: () => location.reload(),
    });
  }

  seleccionRespuesta(seleccion: PregResp) {
    this.respuestas[seleccion.pregunta] = seleccion.respuesta;
  }

  mostrarGrafica() {
    if (!this.cuestionario.terminada) {
      Swal.fire({
        title: 'Oops!',
        text: 'Este cuestionario no ha sido terminado',
        icon: 'warning',
      });
      return;
    }

    this.cuestionario.preguntas.forEach((p) => {
      for (let i = 1; i <= 3; i++) {
        const respuesta = p[`respuesta${i}`];
        if (respuesta.seleccionada) {
          this.valores.push(parseInt(respuesta.valor, 10));
        }
      }
    });

    this.myCanvas.nativeElement.classList.remove('d-none');
    this.graficar(this.valores, this.myCanvas.nativeElement.getContext('2d'));
  }

  async borrarRespuestas() {
    const respuesta = await this.usersService.borrarRespuestas(
      this.cuestionario.docId
    );

    if (!respuesta.exito) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo borrar las respuestas',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: 'Exito!',
      text: 'Se borraron las respuestas',
      icon: 'success',
    });
  }

  graficar(valores, ctx) {
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Pregunta 1',
          'Pregunta 2',
          'Pregunta 3',
          'Pregunta 4',
          'Pregunta 5',
        ],
        datasets: [
          {
            label: 'Valor',
            data: valores,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          xAxes: [
            {
              ticks: {
                maxRotation: 90,
                minRotation: 80,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}

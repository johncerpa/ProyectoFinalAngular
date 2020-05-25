import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users/users.service';

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

  respuestas = [];

  constructor(private usersService: UsersService) {}

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
}

import { Component, OnInit, Input } from '@angular/core';

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

  preguntas = [];

  constructor() {}

  ngOnInit(): void {}

  enviarRespuestas(docId: string) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < 5; i++) {
      if (!this.preguntas[i]) {
        console.log('Debe responder todas las preguntas');
      }
    }
  }

  seleccionRespuesta(seleccion: PregResp) {
    this.preguntas[seleccion.pregunta] = seleccion.respuesta;
  }
}

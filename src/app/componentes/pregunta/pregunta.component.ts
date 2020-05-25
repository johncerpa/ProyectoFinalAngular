import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface PregResp {
  respuesta: number;
  pregunta: number;
}

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css'],
})
export class PreguntaComponent implements OnInit {
  @Input() pregunta;
  @Input() idxPregunta;

  @Output() respuestaSeleccionada: EventEmitter<PregResp>;

  seleccionada = false;

  constructor() {
    this.respuestaSeleccionada = new EventEmitter();
  }

  ngOnInit(): void {}

  seleccionRespuesta(respuesta: number) {
    this.seleccionada = true;

    if (respuesta === 1) {
      this.pregunta.respuesta1.seleccionada = true;
      this.pregunta.respuesta2.seleccionada = false;
      this.pregunta.respuesta3.seleccionada = false;
    }

    if (respuesta === 2) {
      this.pregunta.respuesta1.seleccionada = false;
      this.pregunta.respuesta2.seleccionada = true;
      this.pregunta.respuesta3.seleccionada = false;
    }

    if (respuesta === 3) {
      this.pregunta.respuesta1.seleccionada = false;
      this.pregunta.respuesta2.seleccionada = false;
      this.pregunta.respuesta3.seleccionada = true;
    }

    this.respuestaSeleccionada.emit({ respuesta, pregunta: this.idxPregunta });
  }
}

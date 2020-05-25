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

  constructor() {
    this.respuestaSeleccionada = new EventEmitter();
  }

  ngOnInit(): void {}

  seleccionRespuesta(respuesta: number) {
    this.respuestaSeleccionada.emit({ respuesta, pregunta: this.idxPregunta });
  }
}

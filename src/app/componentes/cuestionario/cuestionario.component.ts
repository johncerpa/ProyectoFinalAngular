import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css'],
})
export class CuestionarioComponent implements OnInit {
  @Input() cuestionario;
  @Input() idxCuestionario;

  constructor() {}

  ngOnInit(): void {}

  enviarRespuestas(docId: string, respuestas) {
    return '';
  }
}

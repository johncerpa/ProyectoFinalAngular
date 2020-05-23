import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-cuestionarios',
  templateUrl: './ver-cuestionarios.component.html',
  styleUrls: ['./ver-cuestionarios.component.css'],
})
export class VerCuestionariosComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
}

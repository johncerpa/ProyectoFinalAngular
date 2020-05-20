import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  correo = '';
  clave = '';

  constructor(public authService: AuthService) {}

  ingresar() {
    this.authService.ingresar(this.correo, this.clave);
  }

  ngOnInit(): void {}
}

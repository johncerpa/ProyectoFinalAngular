import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users/users.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  mostrarSpinner = false;

  constructor(public usersService: UsersService) {}

  ngOnInit(): void {}
}

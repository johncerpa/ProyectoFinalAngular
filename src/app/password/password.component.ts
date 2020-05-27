import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  constructor(private _location: Location) {}

  back() {
    this._location.back();
  }

  ngOnInit(): void {}
}

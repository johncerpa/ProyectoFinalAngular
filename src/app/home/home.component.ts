import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  operadores: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    this.operadores = firestore
      .collection('usuario', (ref) => ref.where('cargo', '==', 'Operador'))
      .valueChanges();
  }
}

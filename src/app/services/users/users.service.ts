import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private coleccionOperadores: AngularFirestoreCollection<any>;
  public operadores: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    this.coleccionOperadores = this.firestore.collection<any>('usuario');
    this.operadores = this.coleccionOperadores.valueChanges();
  }

  agregarOperador(operador) {
    this.coleccionOperadores.add(operador);
  }
}

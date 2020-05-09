import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // User is logged in
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        console.log(JSON.parse(localStorage.getItem('user')));
      } else {
        // User is logged out
        this.userData = null;
        localStorage.removeItem('user');
      }
    });
  }

  ingresar(email, password) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get estaLogueado(): boolean {
    return !!localStorage.getItem('user');
  }

  salir() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['ingreso']);
    });
  }
}

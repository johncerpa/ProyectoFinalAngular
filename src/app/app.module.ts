import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './services/auth/auth.service';
import { SignupOperatorComponent } from './signup-operator/signup-operator.component';
import { QuestionsComponent } from './questions/questions.component';
import { HomeOperadorComponent } from './home-operador/home-operador.component';
import { VerCuestionariosComponent } from './ver-cuestionarios/ver-cuestionarios.component';
import { CuestionarioComponent } from './componentes/cuestionario/cuestionario.component';
import { EditComponent } from './edit/edit.component';
import { PreguntaComponent } from './componentes/pregunta/pregunta.component';
import { PasswordComponent } from './password/password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    ProfileComponent,
    SignupOperatorComponent,
    QuestionsComponent,
    HomeOperadorComponent,
    VerCuestionariosComponent,
    CuestionarioComponent,
    EditComponent,
    PreguntaComponent,
    PasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    FormsModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}

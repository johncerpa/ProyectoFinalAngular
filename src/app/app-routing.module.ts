import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/guard/auth.guard';
import { LoggedInGuard } from './services/guard/logged-in.guard';
import { ProfileComponent } from './profile/profile.component';
import { SignupOperatorComponent } from './signup-operator/signup-operator.component';
import { QuestionsComponent } from './questions/questions.component';

const routes: Routes = [
  { path: '', redirectTo: '/ingreso', pathMatch: 'full' },
  { path: 'ingreso', component: LoginComponent, canActivate: [LoggedInGuard] },
  {
    path: 'registro',
    component: SignupComponent,
    canActivate: [LoggedInGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: ProfileComponent },
  { path: 'registroOperador', component: SignupOperatorComponent },
  { path: 'cuestionario', component: QuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

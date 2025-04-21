import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: InicioComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: "**", pathMatch: "full", redirectTo: "" }
];

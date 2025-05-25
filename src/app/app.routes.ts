import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { CursosComponent } from './componentes/cursos/cursos.component';
import { ExamenesComponent } from './componentes/examenes/examenes.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: InicioComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'cursos', component: CursosComponent},
    { path: 'cursos/:cursoId/examenes', component: ExamenesComponent},
    { path: "**", pathMatch: "full", redirectTo: "" }
];

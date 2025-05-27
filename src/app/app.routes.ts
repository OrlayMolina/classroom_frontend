import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { CursosComponent } from './componentes/cursos/cursos.component';
import { ExamenesComponent } from './componentes/examenes/examenes.component';
import { CrearExamenComponent } from './componentes/crear-examen/crear-examen.component';
import { CrearCursoComponent } from './componentes/crear-curso/crear-curso.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: InicioComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'cursos', component: CursosComponent},
    { path: 'cursos/nuevo', component: CrearCursoComponent},
    { path: 'cursos/:cursoId/examenes', component: ExamenesComponent},
    { path: 'cursos/examenes/crear-examen', component: CrearExamenComponent},
    { path: "**", pathMatch: "full", redirectTo: "" }
];

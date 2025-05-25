import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CursoService } from '../../servicios/curso.service';
import { TokenService } from '../../servicios/token.service';
import { CommonModule } from '@angular/common';
import { CursoDto } from '../../dto/curso-dto';

@Component({
  selector: 'app-cursos',
  imports: [ RouterModule, ReactiveFormsModule, FormsModule, CommonModule ],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent implements OnInit {
  cursos: CursoDto[] = [];
  loading: boolean = true;
  error: string | null = null;
  usuario: any;
  usuarioId: number = 0;
  esProfesor: boolean = false;

  constructor(
    private cursoService: CursoService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarCursos();
  }

  cargarDatosUsuario(): void {
    this.usuario = this.tokenService.getUsuarioActual();
    // Verificamos si el usuario es profesor (rol 1) o estudiante (rol 2)
    this.esProfesor = this.usuario?.rolId === 1;
    this.usuarioId = Number(this.tokenService.getIDCuenta());
  }

  cargarCursos(): void {
    this.loading = true;

    if (this.esProfesor) {
      // Si es profesor, obtener sus cursos
      this.cursoService.obtenerCursosProfesor(this.usuarioId).subscribe(
        (data) => {
          this.cursos = data.respuesta;
          this.loading = false;
        },
        (error) => {
          this.error = 'Error al cargar los cursos. Por favor, intente nuevamente.';
          this.loading = false;
          console.error('Error al cargar cursos:', error);
        }
      );
    } else {
      // Si es estudiante, obtener los cursos donde está matriculado
      this.cursoService.obtenerCursosEstudiante(this.usuario.usuarioId).subscribe(
        (data) => {
          this.cursos = data.respuesta;
          this.loading = false;
        },
        (error) => {
          this.error = 'Error al cargar los cursos. Por favor, intente nuevamente.';
          this.loading = false;
          console.error('Error al cargar cursos:', error);
        }
      );
    }
  }

  crearCurso(): void {
    this.router.navigate(['/cursos/nuevo']);
  }

  verCurso(cursoId: number): void {
    this.router.navigate(['/cursos', cursoId]);
  }

  verExamenes(cursoId: number): void {
    this.router.navigate(['/cursos', cursoId, 'examenes']);
  }
}
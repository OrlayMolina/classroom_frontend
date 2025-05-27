import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../servicios/curso.service';
import { TokenService } from '../../servicios/token.service';

interface PlanEstudio {
  id: number;
  nombre: string;
}

interface DiaSemana {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-crear-curso',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-curso.component.html',
  styleUrl: './crear-curso.component.css'
})
export class CrearCursoComponent implements OnInit {
  cursoForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  usuarioId: number = 0;

  // Datos para los selects (estos deberían venir de servicios)
  planesEstudio: PlanEstudio[] = [
    { id: 1, nombre: 'Ingeniería de Sistemas' },
    { id: 2, nombre: 'Ingeniería Industrial' },
    { id: 3, nombre: 'Administración de Empresas' },
    { id: 4, nombre: 'Contaduría Pública' },
    { id: 5, nombre: 'Psicología' }
  ];

  diasSemana: DiaSemana[] = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' }
  ];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      planEstudioId: ['', Validators.required],
      diaId: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
    // Aquí podrías cargar los planes de estudio desde un servicio
    // this.cargarPlanesEstudio();
  }

  cargarDatosUsuario(): void {
    this.usuarioId = Number(this.tokenService.getIDCuenta());
  }

  crearCurso(): void {
    if (this.cursoForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      // Validar que la hora de fin sea posterior a la hora de inicio
      const horaInicio = this.cursoForm.get('horaInicio')?.value;
      const horaFin = this.cursoForm.get('horaFin')?.value;
      
      if (horaInicio && horaFin && horaInicio >= horaFin) {
        this.error = 'La hora de fin debe ser posterior a la hora de inicio';
        this.loading = false;
        return;
      }

      // Preparar los datos del curso
      const cursoData = {
        nombre: this.cursoForm.get('nombre')?.value,
        planEstudioId: Number(this.cursoForm.get('planEstudioId')?.value),
        profesorId: this.usuarioId,
        diaId: Number(this.cursoForm.get('diaId')?.value),
        horaInicio: this.cursoForm.get('horaInicio')?.value,
        horaFin: this.cursoForm.get('horaFin')?.value,
        ubicacion: this.cursoForm.get('ubicacion')?.value
      };

      // Llamar al servicio para crear el curso
      this.cursoService.crear(cursoData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.error) {
            this.error = response.respuesta || 'Error al crear el curso';
          } else {
            this.success = 'Curso creado exitosamente';
            this.cursoForm.reset();
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/cursos']);
            }, 2000);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error al crear el curso. Por favor, intente nuevamente.';
          console.error('Error al crear curso:', error);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.cursoForm.controls).forEach(key => {
        this.cursoForm.get(key)?.markAsTouched();
      });
    }
  }

  volver(): void {
    this.router.navigate(['/cursos']);
  }

  // Método para cargar planes de estudio desde un servicio (opcional)
  // cargarPlanesEstudio(): void {
  //   this.planEstudioService.obtenerTodos().subscribe({
  //     next: (response) => {
  //       if (!response.error) {
  //         this.planesEstudio = response.respuesta;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar planes de estudio:', error);
  //     }
  //   });
  // }

  // Método para cargar días de la semana desde un servicio (opcional)
  // cargarDiasSemana(): void {
  //   this.diaService.obtenerTodos().subscribe({
  //     next: (response) => {
  //       if (!response.error) {
  //         this.diasSemana = response.respuesta;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar días de la semana:', error);
  //     }
  //   });
  // }
}
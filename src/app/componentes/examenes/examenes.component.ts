import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamenService } from '../../servicios/examenes.service';
import { TokenService } from '../../servicios/token.service';
import { ExamenResponseDto } from '../../dto/examen-response-dto';
import { ExamenDto } from '../../dto/examen-dto';

@Component({
  selector: 'app-examenes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})
export class ExamenesComponent implements OnInit {
  examenes: ExamenResponseDto[] = [];
  cursoId: number = 0;
  loading: boolean = true;
  error: string | null = null;
  usuario: any;
  esProfesor: boolean = false;
  nombreCurso: string = '';

  // Filtros
  filtroTipo: string = 'todos';
  filtroEstado: string = 'todos';
  busqueda: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examenService: ExamenService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.obtenerCursoId();
    this.cargarExamenes();
  }

  cargarDatosUsuario(): void {
    this.usuario = this.tokenService.getUsuarioActual();
    this.esProfesor = this.usuario?.rolId === 1;
  }

  obtenerCursoId(): void {
    this.route.params.subscribe(params => {
      this.cursoId = +params['cursoId']; // Cambiar a 'cursoid' si mantienes esa ruta
    });
  }

  cargarExamenes(): void {
    this.loading = true;
    this.error = null;

    this.examenService.obtenerExamenesPorCurso(this.cursoId).subscribe({
      next: (response) => {
        this.examenes = response.respuesta || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los exámenes. Por favor, intente nuevamente.';
        this.loading = false;
        console.error('Error al cargar exámenes:', error);
      }
    });
  }

  get examenesFiltrados(): ExamenResponseDto[] {
    let resultado = this.examenes;

    // Filtro por tipo
    if (this.filtroTipo !== 'todos') {
      resultado = resultado.filter(examen => 
        examen.tipoPruebaNombre.toLowerCase() === this.filtroTipo.toLowerCase()
      );
    }

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(examen => {
        const ahora = new Date();
        const fechaExamen = new Date(examen.fechaProgramada);
        
        switch (this.filtroEstado) {
          case 'disponible':
            return fechaExamen <= ahora;
          case 'proximamente':
            return fechaExamen > ahora;
          default:
            return true;
        }
      });
    }

    // Filtro por búsqueda
    if (this.busqueda.trim()) {
      resultado = resultado.filter(examen =>
        examen.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        examen.descripcion?.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }

    return resultado;
  }

  // Métodos para estadísticas (para evitar lógica compleja en el template)
  get totalExamenes(): number {
    return this.examenesFiltrados.length;
  }

  get examenesDisponibles(): number {
    return this.examenesFiltrados.filter(e => this.obtenerEstadoExamen(e).estado === 'Disponible').length;
  }

  get examenesProximamente(): number {
    return this.examenesFiltrados.filter(e => this.obtenerEstadoExamen(e).estado === 'Próximamente').length;
  }

  get totalPresentaciones(): number {
    return this.examenesFiltrados.reduce((sum, e) => sum + (e.numeroEstudiantes || 0), 0);
  }

  // TrackBy function para mejorar performance
  trackByExamenId(index: number, examen: ExamenResponseDto): number {
    return examen.examenId;
  }

  crearExamen(): void {
    this.router.navigate(['cursos/examenes/crear-examen']);
  }

  verExamen(examenId: number): void {
    this.router.navigate(['/examenes', examenId]);
  }

  editarExamen(examenId: number): void {
    this.router.navigate(['/cursos', this.cursoId, 'examenes', examenId, 'editar']);
  }

  presentarExamen(examenId: number): void {
    this.router.navigate(['/examenes', examenId, 'presentar']);
  }

  verResultados(examenId: number): void {
    this.router.navigate(['/examenes', examenId, 'resultados']);
  }

  duplicarExamen(examenId: number): void {
    const nombreCopia = prompt('Ingrese el nombre para la copia del examen:');
    if (nombreCopia) {
      this.examenService.duplicarExamen(examenId, nombreCopia).subscribe({
        next: () => {
          this.cargarExamenes();
        },
        error: (error) => {
          this.error = 'Error al duplicar el examen';
          console.error('Error:', error);
        }
      });
    }
  }

  eliminarExamen(examenId: number): void {
    if (confirm('¿Está seguro de que desea eliminar este examen? Esta acción no se puede deshacer.')) {
      this.examenService.eliminarExamen(examenId).subscribe({
        next: () => {
          this.cargarExamenes();
        },
        error: (error) => {
          this.error = 'Error al eliminar el examen';
          console.error('Error:', error);
        }
      });
    }
  }

  obtenerEstadoExamen(examen: ExamenResponseDto): { estado: string; clase: string; icono: string } {
    const ahora = new Date();
    const fechaExamen = new Date(examen.fechaProgramada);

    if (fechaExamen > ahora) {
      return {
        estado: 'Próximamente',
        clase: 'bg-yellow-100 text-yellow-800',
        icono: 'clock'
      };
    } else {
      return {
        estado: 'Disponible',
        clase: 'bg-green-100 text-green-800',
        icono: 'check'
      };
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  obtenerIconoTipo(tipo: string): string {
  if (!tipo) {
    return 'fas fa-book'; // icono de librito
  }
  
  switch (tipo.toLowerCase()) {
    case 'parcial':
      return 'fas fa-file-alt';
    case 'final':
      return 'fas fa-graduation-cap';
    case 'quiz':
      return 'fas fa-question-circle';
    default:
      return 'fas fa-book';
  }
}

  volverACursos(): void {
    this.router.navigate(['/cursos']);
  }
}
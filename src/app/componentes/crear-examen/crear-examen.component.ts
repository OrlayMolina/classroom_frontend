import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { ExamenService } from '../../servicios/examenes.service';
import { ExamenResponseDto } from '../../dto/examen-response-dto';

// Interfaces
export interface TipoPrueba {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Tema {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CrearExamenRequest {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  cantBancoPreguntas: number;
  cantPreguntasEstudiante: number;
  limiteTiempo: number;
  fechaProgramada: string;
  tipoPruebaId: number;
  profesorId: number;
  temaId?: number;
  cursoId: number;
  pesoCurso: number;
  umbralAprobacion: number;
  aleatorizarPreguntas?: boolean;
  aleatorizarOpciones?: boolean;
  mostrarProgreso?: boolean;
  mostrarRetroalimentacion?: boolean;
}

@Component({
  selector: 'app-crear-examen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-examen.component.html',
  styleUrls: ['./crear-examen.component.css']
})
export class CrearExamenComponent implements OnInit, OnDestroy {
  
  // Inyección de dependencias usando inject()
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private examenService = inject(ExamenService);

  // Variables del componente
  examenForm!: FormGroup;
  examenId: number | null = null;
  cursoId: number = 0;
  profesorId: number = 0;
  
  // Estados
  loading = false;
  loadingData = false;
  error: string | null = null;
  success: string | null = null;

  // Datos para los selects (temporalmente hardcodeados)
  tiposPrueba: TipoPrueba[] = [
    { id: 1, nombre: 'Quiz' },
    { id: 2, nombre: 'Examen Parcial' },
    { id: 3, nombre: 'Examen Final' },
    { id: 4, nombre: 'Tarea' }
  ];
  
  temas: Tema[] = [
    { id: 1, nombre: 'Tema 1: Introducción' },
    { id: 2, nombre: 'Tema 2: Fundamentos' },
    { id: 3, nombre: 'Tema 3: Aplicaciones' }
  ];

  // Para manejar las suscripciones
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    // Obtener parámetros de la ruta
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.examenId = params['id'] ? Number(params['id']) : null;
      this.cursoId = params['cursoId'] ? Number(params['cursoId']) : 0;
    });

    // Obtener datos del usuario (profesor)
    this.profesorId = this.getUserId(); // Implementar según tu sistema de auth

    // Inicializar formulario
    this.initializeForm();

    // Cargar datos necesarios
    this.loadInitialData();
  }

  private initializeForm(): void {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const defaultDateTime = tomorrow.toISOString().slice(0, 16);

    this.examenForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      categoria: ['', [Validators.maxLength(50)]],
      cantBancoPreguntas: [20, [Validators.required, Validators.min(1), Validators.max(1000)]],
      cantPreguntasEstudiante: [10, [Validators.required, Validators.min(1)]],
      limiteTiempo: [60, [Validators.required, Validators.min(1), Validators.max(600)]],
      fechaProgramada: [defaultDateTime, [Validators.required]],
      tipoPruebaId: ['', [Validators.required]],
      temaId: [''],
      pesoCurso: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
      umbralAprobacion: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      aleatorizarPreguntas: [false],
      aleatorizarOpciones: [false],
      mostrarProgreso: [true],
      mostrarRetroalimentacion: [true]
    });

    // Validación cruzada: cantPreguntasEstudiante <= cantBancoPreguntas
    //this.examenForm.addValidators(this.validatePreguntasCount.bind(this));
  }

  private validatePreguntasCount(form: FormGroup) {
    const banco = form.get('cantBancoPreguntas')?.value;
    const estudiante = form.get('cantPreguntasEstudiante')?.value;
    
    if (banco && estudiante && estudiante > banco) {
      return { preguntasExceden: true };
    }
    return null;
  }

  private loadInitialData(): void {
    this.loadingData = true;
    this.error = null;

    // Por ahora usar datos hardcodeados, más adelante se pueden integrar los servicios
    // const requests = [
    //   this.tipoPruebaService.obtenerTipos(),
    //   this.temaService.obtenerTemasPorCurso(this.cursoId)
    // ];

    // Simular carga de datos
    setTimeout(() => {
      // Los datos ya están inicializados en el constructor
      // Si estamos editando, cargar los datos del examen
      if (this.examenId) {
        this.loadExamenData();
      } else {
        this.loadingData = false;
      }
    }, 500);

    // forkJoin(requests)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: ([tiposResponse, temasResponse]) => {
    //       this.tiposPrueba = tiposResponse.data || [];
    //       this.temas = temasResponse.data || [];
    //       
    //       // Si estamos editando, cargar los datos del examen
    //       if (this.examenId) {
    //         this.loadExamenData();
    //       } else {
    //         this.loadingData = false;
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Error cargando datos iniciales:', error);
    //       this.error = 'Error al cargar los datos necesarios para el formulario';
    //       this.loadingData = false;
    //     }
    //   });
  }

  private loadExamenData(): void {
    if (!this.examenId) return;

    this.examenService.obtenerExamenPorId(this.examenId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.error && response.data) {
            this.populateForm(response.data);
          } else {
            this.error = 'Error al cargar los datos del examen';
          }
          this.loadingData = false;
        },
        error: (error) => {
          console.error('Error cargando examen:', error);
          this.error = 'Error al cargar los datos del examen';
          this.loadingData = false;
        }
      });
  }

  private populateForm(examen: ExamenResponseDto): void {
    // Convertir fecha al formato datetime-local
    const fechaFormatted = this.formatDateForInput(examen.fechaProgramada);

    this.examenForm.patchValue({
      nombre: examen.nombre,
      descripcion: examen.descripcion || '',
      categoria: examen.categoria || '',
      cantBancoPreguntas: examen.cantBancoPreguntas,
      cantPreguntasEstudiante: examen.cantPreguntasEstudiante,
      limiteTiempo: examen.limiteTiempo,
      fechaProgramada: fechaFormatted,
      tipoPruebaId: examen.tipoPruebaId,
      temaId: examen.temaId || '',
      pesoCurso: examen.pesoCurso,
      umbralAprobacion: examen.umbralAprobacion
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  private getUserId(): number {
    // Implementar según tu sistema de autenticación
    // Por ejemplo, desde localStorage, sessionStorage, o un servicio de auth
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData).id;
    }
    return 1; // Valor por defecto para desarrollo
  }

  // Métodos públicos del componente
  isFieldInvalid(fieldName: string): boolean {
    const field = this.examenForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.examenForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} es obligatorio`;
      if (field.errors['minlength']) return `${fieldName} es muy corto`;
      if (field.errors['maxlength']) return `${fieldName} es muy largo`;
      if (field.errors['min']) return `Valor mínimo no válido`;
      if (field.errors['max']) return `Valor máximo no válido`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.examenForm.invalid) {
      this.markAllFieldsAsTouched();
      this.error = 'Por favor, complete todos los campos obligatorios correctamente';
      return;
    }

    // Validación adicional
    if (this.examenForm.errors?.['preguntasExceden']) {
      this.error = 'El número de preguntas para el estudiante no puede ser mayor al banco de preguntas';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formData = this.prepareFormData();

    // const operation = this.examenId 
    //   ? this.examenService.actualizarExamen(this.examenId)
    //   : this.examenService.crearExamen(formData);

    // operation.pipe(takeUntil(this.destroy$)).subscribe({
    //   next: (response) => {
    //     if (!response.error) {
    //       const mensaje = this.examenId 
    //         ? 'Examen actualizado exitosamente' 
    //         : 'Examen creado exitosamente';
          
    //       this.success = mensaje;
    //       console.log(mensaje); // Temporal hasta tener NotificationService
          
    //       // Redirigir después de un breve delay
    //       setTimeout(() => {
    //         this.router.navigate(['/cursos', this.cursoId, 'examenes']);
    //       }, 2000);
    //     } else {
    //       this.error = response.message || 'Error al procesar el examen';
    //     }
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error en operación de examen:', error);
    //     this.error = 'Error al procesar el examen. Intente nuevamente.';
    //     this.loading = false;
    //   }
    // });
  }

  private prepareFormData(): CrearExamenRequest {
    const formValue = this.examenForm.value;
    
    return {
      nombre: formValue.nombre.trim(),
      descripcion: formValue.descripcion?.trim() || undefined,
      categoria: formValue.categoria?.trim() || undefined,
      cantBancoPreguntas: Number(formValue.cantBancoPreguntas),
      cantPreguntasEstudiante: Number(formValue.cantPreguntasEstudiante),
      limiteTiempo: Number(formValue.limiteTiempo),
      fechaProgramada: new Date(formValue.fechaProgramada).toISOString(),
      tipoPruebaId: Number(formValue.tipoPruebaId),
      profesorId: this.profesorId,
      temaId: formValue.temaId ? Number(formValue.temaId) : undefined,
      cursoId: this.cursoId,
      pesoCurso: Number(formValue.pesoCurso),
      umbralAprobacion: Number(formValue.umbralAprobacion),
      aleatorizarPreguntas: Boolean(formValue.aleatorizarPreguntas),
      aleatorizarOpciones: Boolean(formValue.aleatorizarOpciones),
      mostrarProgreso: Boolean(formValue.mostrarProgreso),
      mostrarRetroalimentacion: Boolean(formValue.mostrarRetroalimentacion)
    };
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.examenForm.controls).forEach(key => {
      this.examenForm.get(key)?.markAsTouched();
    });
  }

  guardarBorrador(): void {
    if (this.examenForm.get('nombre')?.invalid) {
      this.error = 'El nombre del examen es obligatorio para guardar como borrador';
      return;
    }

    // Implementar lógica para guardar borrador
    // Podría ser una llamada diferente al backend o localStorage
    console.log('Funcionalidad de borrador en desarrollo'); // Temporal
  }

  cancelar(): void {
    // if (this.examenForm.dirty) {
    //   const confirmacion = confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.');
    //   if (!confirmación) return;
    // }
    
    this.volverAtras();
  }

  volverAtras(): void {
    this.router.navigate(['/cursos', 1, 'examenes']);
  }

  // Métodos auxiliares para el template
  get isEditing(): boolean {
    return !!this.examenId;
  }

  get formTitle(): string {
    return this.isEditing ? 'Editar Examen' : 'Crear Nuevo Examen';
  }

  get submitButtonText(): string {
    if (this.loading) return 'Procesando...';
    return this.isEditing ? 'Actualizar Examen' : 'Crear Examen';
  }
}
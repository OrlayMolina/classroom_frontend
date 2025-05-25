import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioDto } from '../../dto/usuario-dto';
import { UserService } from '../../servicios/user.service';
import { TokenService } from '../../servicios/token.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [
    ReactiveFormsModule, FormsModule, RouterModule, CommonModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioDto | null = null;
  perfilForm: FormGroup;
  loading = true;
  editMode = false;
  successMessage = '';
  errorMessage = '';
  nombreRol: string = '';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {
    this.perfilForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      documentoId: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    const usuarioId = this.tokenService.getIDCuenta();
    
    if (usuarioId) {
      this.userService.getUsuario(parseInt(usuarioId)).subscribe({
        next: (data) => {
          this.usuario = data.respuesta;
          this.perfilForm.patchValue({
            email: data.respuesta.email,
            documentoId: data.respuesta.documentoId,
            nombre: data.respuesta.nombre,
            apellido: data.respuesta.apellido
          });
          this.loading = false;
          this.cargarNombreRol(parseInt(usuarioId));
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario', err);
          this.errorMessage = 'No se pudieron cargar los datos del usuario';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'No se encontró información de autenticación';
      this.loading = false;
    }
  }

  cargarNombreRol(usuarioId: number): void {
    this.userService.nombreRolUsuario(usuarioId).subscribe({
      next: (data) => {
        if (data.respuesta) {
          this.nombreRol = data.respuesta.nombreRol;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el rol del usuario', err);
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.successMessage = '';
    this.errorMessage = '';
  }

  guardarCambios(): void {
    const usuarioId = this.tokenService.getIDCuenta();
    const id = Number(usuarioId);
    if (this.perfilForm.valid && this.usuario) {
      const usuarioActualizado: UsuarioDto = {
        ...this.usuario,
        usuarioId: this.usuario.usuarioId,
        email: this.perfilForm.get('email')?.value,
        clave: this.usuario.clave,
        documentoId: this.perfilForm.get('documentoId')?.value,
        nombre: this.perfilForm.get('nombre')?.value,
        apellido: this.perfilForm.get('apellido')?.value,
        rolId: this.usuario.rolId,
        nombreRol: this.usuario.nombreRol
      };

      this.userService.actualizarUsuario(id, usuarioActualizado).subscribe({
        next: (response) => {
          this.successMessage = 'Perfil actualizado correctamente';
          this.usuario = usuarioActualizado;
          this.editMode = false;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error al actualizar el perfil', err);
          this.errorMessage = 'No se pudo actualizar el perfil';
        }
      });
    }
  }

  cancelarEdicion(): void {
    if (this.usuario) {
      this.perfilForm.patchValue({
        email: this.usuario.email,
        documentoId: this.usuario.documentoId,
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido
      });
    }
    this.editMode = false;
  }
}
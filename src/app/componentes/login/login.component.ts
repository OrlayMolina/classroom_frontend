import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginDTO } from '../../dto/login-dto';
import Swal from 'sweetalert2';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, FormsModule, RouterModule, CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginDTO: LoginDTO;
  mostrarAlerta: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.loginDTO = {
      email: '',
      password: '',
    };
  }

  public logearse() {
    this.authService.login(this.loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token);

        const decodedToken = this.tokenService.decodePayload(
          data.respuesta.token
        );
        const usuario = decodedToken.email;

        this.authService.setUser(usuario);

        setTimeout(() => {
          this.router.navigate(['/inicio']);
        }, 1500);
      },
      error: (error) => {
        Swal.fire({
          title: 'Login Fallido',
          text: error.error.respuesta.token,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0078C8',
        });

        setTimeout(() => {
          this.loginDTO.password = '';
        }, 2000);
      },
    });
  }
}

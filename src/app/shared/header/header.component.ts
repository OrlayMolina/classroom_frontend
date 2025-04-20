import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from '../../servicios/token.service';
import { AuthService } from '../../servicios/auth.service';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  mostrarElementos: boolean = true;
  correo: string = '';
  isLoggedIn: boolean = false;
  userMenuOpen: boolean = false;
  
  private authSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(
    private router: Router, 
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar inicialmente
    this.verificarToken();
    this.verificarRuta();
    
    // Suscripción a eventos de navegación
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.verificarRuta();
        this.verificarToken(); // Verificar nuevamente el token en cada navegación
      });
    
    // Suscribirse a cambios de autenticación
    this.authSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.correo = user;
      } else {
        this.verificarToken(); // Verificar por si hay un token guardado
      }
    });
    
    // Evento para cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    
    // Eliminar event listener
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  verificarRuta(): void {
    const rutaActual = this.router.url;
    // No mostrar elementos en la página de login
    this.mostrarElementos = !['/login'].includes(rutaActual);
  }

  verificarToken(): void {
    const token = this.tokenService.getToken();
    if (token) {
      const payload = this.tokenService.decodePayload(token);
      this.isLoggedIn = true;
      this.correo = payload.correo || '';
      // Actualizar el servicio de autenticación también
      if (this.correo) {
        this.authService.setUser(this.correo);
      }
    } else {
      this.isLoggedIn = false;
      this.correo = '';
    }
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.userMenuOpen = !this.userMenuOpen;
  }

  handleDocumentClick(event: Event): void {
    // Cerrar el menú si se hace clic fuera de él
    if (this.userMenuOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        this.userMenuOpen = false;
      }
    }
  }

  logout(): void {
    this.tokenService.logout();
    this.authService.logout();
    this.userMenuOpen = false;
  }
}
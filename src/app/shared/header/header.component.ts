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
  email: string = '';
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
    this.verificarToken();
    this.verificarRuta();
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.verificarRuta();
        this.verificarToken();
      });
    
    this.authSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.email = user;
      } else {
        this.verificarToken();
      }
    });

    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  ngOnDestroy(): void {

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  verificarRuta(): void {
    const rutaActual = this.router.url;
    this.mostrarElementos = !['/login'].includes(rutaActual);
  }

  verificarToken(): void {
    const token = this.tokenService.getToken();
    if (token) {
      const payload = this.tokenService.decodePayload(token);
      this.isLoggedIn = true;
      this.email = payload.email || '';
      if (this.email) {
        this.authService.setUser(this.email);
      }
    } else {
      this.isLoggedIn = false;
      this.email = '';
    }
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.userMenuOpen = !this.userMenuOpen;
  }

  handleDocumentClick(event: Event): void {
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
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService){}

  /** Calls AuthService.login() and shows an error message on failure. */
  async onSubmit() {
    this.loading = true;
    this.error = '';
    const ok = await this.authService.login(this.email, this.password);
    this.loading = false;
    if (!ok) {
      this.error = 'Email o contraseña incorrectos';
    }
  }
}

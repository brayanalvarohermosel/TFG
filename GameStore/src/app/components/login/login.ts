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
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService){}

  onSubmit() {
    const ok = this.authService.login(this.username, this.password);
    if (!ok) {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }
}

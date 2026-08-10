import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  password = '';
  loading = false;
  error = false;
  showPassword = false;

  async submit() {
    if (!this.password.trim()) return;
    this.loading = true;
    this.error = false;
    try {
      const { error } = await this.auth.login(this.password);
      error ? (this.error = true) : this.router.navigateByUrl('/');
    } catch {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

}

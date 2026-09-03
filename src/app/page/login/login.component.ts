import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  attempts = signal(0);
  password = signal('');
  loading = signal(false);
  error = signal(false);
  showPassword = signal(false);

  canSubmit = computed(() => !this.loading() && this.password().trim().length > 0 && !this.tooManyAttempts());
  tooManyAttempts = computed(() => this.attempts() > 5);

  onPasswordChange(value: string) {
    this.password.set(value);
    this.error.set(false);
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  async submit() {
    if (!this.canSubmit()) return;
    if(this.tooManyAttempts()) return;
    this.loading.set(true);
    this.error.set(false);
    try {
      const { error } = await this.auth.login(this.password());
      error ? this.error.set(true) : this.router.navigateByUrl('/');
    } catch {
      this.error.set(true);
    } finally {
      this.attempts.set(this.attempts()+1);
      this.loading.set(false);
    }
  }
}

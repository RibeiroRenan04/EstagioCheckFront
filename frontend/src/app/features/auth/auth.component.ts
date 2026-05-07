import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatTabsModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  busy = signal(false);
  selectedTab = signal(0);

  loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm = this.fb.group({
    fullName:  ['', [Validators.required, Validators.minLength(2)]],
    email:     ['', [Validators.required, Validators.email]],
    password:  ['', [Validators.required, Validators.minLength(6)]],
    matricula: [''],
    role:      ['aluno', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.busy.set(true);
    const { email, password } = this.loginForm.value;
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => { this.snackBar.open('Bem-vindo!', '', { duration: 2000, panelClass: 'snack-success' }); this.router.navigate(['/app']); },
      error: (err) => { this.busy.set(false); this.snackBar.open(err?.error?.message ?? 'Erro ao entrar', '', { duration: 4000, panelClass: 'snack-error' }); }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    this.busy.set(true);
    const v = this.registerForm.value;
    this.auth.register({
      fullName: v.fullName!,
      email: v.email!,
      password: v.password!,
      matricula: v.matricula || undefined,
      role: v.role!
    }).subscribe({
      next: () => { this.snackBar.open('Conta criada!', '', { duration: 2000, panelClass: 'snack-success' }); this.router.navigate(['/app']); },
      error: (err) => { this.busy.set(false); this.snackBar.open(err?.error?.message ?? 'Erro ao cadastrar', '', { duration: 4000, panelClass: 'snack-error' }); }
    });
  }
}

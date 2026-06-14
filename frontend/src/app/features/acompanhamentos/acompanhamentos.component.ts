import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { FollowupsService } from '../../core/services/followups.service';
import { AuthService } from '../../core/services/auth.service';
import { FormativeFollowup } from '../../core/models/models';

@Component({
  selector: 'app-acompanhamentos',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTableModule, MatProgressSpinnerModule, MatSnackBarModule, MatSliderModule
  ],
  templateUrl: './acompanhamentos.component.html',
  styleUrls: ['./acompanhamentos.component.scss']
})
export class AcompanhamentosComponent implements OnInit {
  followups = signal<FormativeFollowup[]>([]);
  loading = signal(true);
  showForm = signal(false);
  selectedFollowup = signal<FormativeFollowup | null>(null);
  role = this.auth.role;

  studentName = signal<string>('');
  lookingUp = signal(false);

  form = this.fb.group({
    rgm: ['', Validators.required],
    studentId: [''], // preenchido automaticamente pela busca por RGM
    scheduleId: [''],
    periodo: [''],
    posturaResponsabilidade: [3, [Validators.min(1), Validators.max(5)]],
    posturaPontualidade: [3, [Validators.min(1), Validators.max(5)]],
    posturaEtica: [3, [Validators.min(1), Validators.max(5)]],
    comunicacaoEquipe: [3, [Validators.min(1), Validators.max(5)]],
    comunicacaoPaciente: [3, [Validators.min(1), Validators.max(5)]],
    comunicacaoEscuta: [3, [Validators.min(1), Validators.max(5)]],
    organizacaoPlanejamento: [3, [Validators.min(1), Validators.max(5)]],
    organizacaoSeguranca: [3, [Validators.min(1), Validators.max(5)]],
    organizacaoRegistros: [3, [Validators.min(1), Validators.max(5)]],
    participacaoIniciativa: [3, [Validators.min(1), Validators.max(5)]],
    participacaoAprendizado: [3, [Validators.min(1), Validators.max(5)]],
    participacaoAutocritica: [3, [Validators.min(1), Validators.max(5)]],
    overallComment: [''],
    goalsNextPeriod: [''],
    strengthsObserved: [''],
    areasForImprovement: [''],
    preceptorNotes: ['']
  });

  constructor(private followupsService: FollowupsService, private auth: AuthService, private snackBar: MatSnackBar, private fb: FormBuilder) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.followupsService.getAll().subscribe({ next: (f) => { this.followups.set(f); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  /** Busca o aluno pelo RGM e preenche o nome ao lado. */
  lookupRgm(): void {
    const rgm = (this.form.get('rgm')?.value ?? '').trim();
    this.studentName.set('');
    this.form.patchValue({ studentId: '' });
    if (!rgm) return;
    this.lookingUp.set(true);
    this.followupsService.getStudentByRgm(rgm).subscribe({
      next: (s) => { this.studentName.set(s.fullName); this.form.patchValue({ studentId: s.studentId }); this.lookingUp.set(false); },
      error: () => { this.studentName.set('Aluno não encontrado'); this.lookingUp.set(false); }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    if (!this.form.get('studentId')?.value) {
      this.snackBar.open('Informe um RGM válido de aluno.', '', { duration: 3000 });
      return;
    }
    const dto = this.form.value as any;
    const op = this.selectedFollowup()
      ? this.followupsService.update(this.selectedFollowup()!.id, dto)
      : this.followupsService.create(dto);
    op.subscribe({
      next: () => { this.snackBar.open('Salvo!', '', { duration: 2000 }); this.showForm.set(false); this.load(); },
      error: () => this.snackBar.open('Erro ao salvar', '', { duration: 3000 })
    });
  }

  finalizePreceptor(id: string): void {
    const name = prompt('Seu nome para assinatura:');
    if (!name) return;
    this.followupsService.finalizePreceptor(id, name).subscribe({ next: () => { this.snackBar.open('Finalizado pelo preceptor!', '', { duration: 2000 }); this.load(); }, error: () => this.snackBar.open('Erro', '', { duration: 3000 }) });
  }

  finalizeStudent(id: string): void {
    const name = prompt('Seu nome para assinatura:');
    if (!name) return;
    this.followupsService.finalizeStudent(id, name).subscribe({ next: () => { this.snackBar.open('Assinado pelo aluno!', '', { duration: 2000 }); this.load(); }, error: () => this.snackBar.open('Erro', '', { duration: 3000 }) });
  }

  openCreate(): void { this.selectedFollowup.set(null); this.studentName.set(''); this.form.reset({ rgm: '', studentId: '', periodo: '', posturaResponsabilidade: 3, posturaPontualidade: 3, posturaEtica: 3, comunicacaoEquipe: 3, comunicacaoPaciente: 3, comunicacaoEscuta: 3, organizacaoPlanejamento: 3, organizacaoSeguranca: 3, organizacaoRegistros: 3, participacaoIniciativa: 3, participacaoAprendizado: 3, participacaoAutocritica: 3 }); this.showForm.set(true); }
}

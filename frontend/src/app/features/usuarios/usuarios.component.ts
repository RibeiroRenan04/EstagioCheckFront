import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersService } from '../../core/services/users.service';
import { GroupsService } from '../../core/services/groups.service';
import { UserDto, StudentGroup } from '../../core/models/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  users = signal<UserDto[]>([]);
  groups = signal<StudentGroup[]>([]);
  loading = signal(true);
  displayedColumns = ['name', 'email', 'role', 'group', 'actions'];

  constructor(private usersService: UsersService, private groupsService: GroupsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.groupsService.getAll().subscribe(g => this.groups.set(g));
    this.usersService.getAll().subscribe({ next: (u) => { this.users.set(u); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  assignGroup(userId: string, groupId: string | null): void {
    this.usersService.assignGroup(userId, groupId).subscribe({
      next: () => this.snackBar.open('Turma atualizada!', '', { duration: 2000 }),
      error: () => this.snackBar.open('Erro ao atualizar', '', { duration: 3000 })
    });
  }

  groupName(groupId: string | null): string {
    if (!groupId) return '—';
    return this.groups().find(g => g.id === groupId)?.name ?? '—';
  }
}

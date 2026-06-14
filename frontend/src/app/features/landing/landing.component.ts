import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Feature { icon: string; title: string; desc: string; }

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  readonly year = new Date().getFullYear();

  readonly features: Feature[] = [
    { icon: 'my_location',       title: 'GPS validado',          desc: 'Tolerância do raio cadastrado por local. Fora do raio = irregular.' },
    { icon: 'photo_camera',      title: 'Foto no momento',       desc: 'Captura pela câmera no check-in para evitar fraudes.' },
    { icon: 'verified',          title: 'Validação automática',  desc: 'Aprovação imediata dentro do horário e do local; manual nos demais casos.' },
    { icon: 'groups',            title: '3 perfis',              desc: 'Aluno registra, preceptor avalia, professor supervisor gerencia tudo.' },
    { icon: 'bar_chart',         title: 'Relatórios',            desc: 'Carga horária, presenças irregulares e avaliações por aluno.' },
    { icon: 'workspace_premium', title: 'Certificados',          desc: 'Emissão ao atingir a carga horária exigida do estágio.' }
  ];
}

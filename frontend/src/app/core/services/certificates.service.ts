import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Certificate } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  private readonly api = `${environment.apiUrl}/certificates`;
  constructor(private http: HttpClient) {}

  /** Certificado de carga horária do próprio aluno autenticado. */
  me(): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.api}/me`);
  }

  /** Lista de certificados de todos os alunos (supervisor). */
  all(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.api);
  }

  /** Certificado de um aluno específico. */
  byStudent(studentId: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.api}/${studentId}`);
  }
}

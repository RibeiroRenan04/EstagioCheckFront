import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Location, BuscaSaudeEstabelecimento } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private readonly api = `${environment.apiUrl}/locations`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.api);
  }

  create(dto: Omit<Location, 'id'>): Observable<Location> {
    return this.http.post<Location>(this.api, dto);
  }

  batchCreate(dtos: Omit<Location, 'id'>[]): Observable<{ inserted: number }> {
    return this.http.post<{ inserted: number }>(`${this.api}/batch`, dtos);
  }

  update(id: string, dto: Omit<Location, 'id'>): Observable<Location> {
    return this.http.put<Location>(`${this.api}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  /** Pesquisa unidades de saúde do DF na API pública do CNES (default: UBS / tipo 2). */
  buscaSaude(q: string, tipo = 2, limit = 50): Observable<BuscaSaudeEstabelecimento[]> {
    let params = new HttpParams()
      .set('tipo', tipo)
      .set('limit', limit);
    if (q?.trim()) params = params.set('q', q.trim());
    return this.http.get<BuscaSaudeEstabelecimento[]>(`${this.api}/busca-saude`, { params });
  }

  /** Importa um estabelecimento do CNES como local de estágio. */
  importFromBuscaSaude(est: BuscaSaudeEstabelecimento): Observable<Location> {
    return this.http.post<Location>(`${this.api}/import-from-busca-saude`, {
      codigoCnes: est.codigoCnes,
      nome: est.nome,
      endereco: est.endereco,
      latitude: est.latitude,
      longitude: est.longitude
    });
  }
}

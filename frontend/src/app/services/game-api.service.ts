import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameApiService {
  constructor(private readonly http: HttpClient) {}

  listDrafts(): Observable<Game[]> {
    return this.http.get<Game[]>(`${environment.apiUrl}/drafts`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from '../models/game.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly API_URl = 'https://698a05f7c04d974bc6a11fd5.mockapi.io/Juegos';

  openForm = new Subject<void>();

  constructor(private http: HttpClient) {}

  currentFilter = new BehaviorSubject<string>('Todos');

  setFilter(platform: string) {
    this.currentFilter.next(platform);
  }

  getGames() {
    return this.http.get<Game[]>(this.API_URl);
  }

  getGameById(id: string) {
    return this.http.get<Game>(`${this.API_URl}/${id}`);
  }

  createGame(game: Game) {
    return this.http.post<Game>(this.API_URl, game);
  }

  updateGame(id: string, game: Game) {
    return this.http.put<Game>(`${this.API_URl}/${id}`, game);
  }

  deleteGame(id: string) {
    return this.http.delete<void>(`${this.API_URl}/${id}`);
  }
}

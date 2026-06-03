import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { BehaviorSubject, Subject, from, map, of } from 'rxjs';
import { supabase } from './supabase';

/**
 * CRUD service for games with in-memory caching.
 * After getGames() fetches all games once, getGameById() can return
 * the cached result instantly without a second Supabase query.
 */
@Injectable({
  providedIn: 'root',
})
export class GameService {

  /** Emits when the admin form should open to create/edit a game. */
  openForm = new Subject<Game | null>();
  /** Emits after a game is created/edited so the list auto-refreshes. */
  gamesChanged = new Subject<void>();
  /** Reactive filter (platform) shared with NavbarComponent. */
  currentFilter = new BehaviorSubject<string>('Todos');
  /** Reactive search term shared with NavbarComponent. */
  searchTerm = new BehaviorSubject<string>('');
  /** Local cache populated by getGames(). */
  private cachedGames: Game[] = [];

  setFilter(platform: string) {
    this.currentFilter.next(platform);
  }

  setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  /** Fetches all games from Supabase and updates the local cache. */
  getGames() {
    return from(supabase.from('games').select('*')).pipe(
      map(({data, error}) => {
        if (error) throw error;
        this.cachedGames = data as Game[];
        return data as Game[];
      })
    );
  }

  /**
   * Returns a game by ID. If the cache is populated, returns it synchronously
   * (via of()) to avoid an unnecessary network round-trip.
   */
  getGameById(id: string) {
    const cached = this.cachedGames.find(g => g.id === id);
    if (cached) {
      return of(cached);
    }
    return from(supabase.from('games').select('*').eq('id', id).single()).pipe(
      map(({data, error}) => {
        if (error) throw error;
        return data as Game;
      })
    );
  }

  /** Creates a new game and emits gamesChanged. */
  createGame(game: Omit<Game, 'id'>) {
    return from(supabase.from('games').insert([game]).select().single()).pipe(
      map(({data, error}) => {
        if (error) throw error;
        return data as Game;
      })
    );
  }

  /** Updates an existing game and emits gamesChanged. */
  updateGame(id: string, game: Partial<Game>) {
    return from(supabase.from('games').update(game).eq('id', id).select().single()).pipe(
      map(({data, error}) => {
        if (error) throw error;
        return data as Game;
      })
    );
  }

  /** Deletes a game by ID and emits gamesChanged. */
  deleteGame(id: string) {
    return from(supabase.from('games').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}

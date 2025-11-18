import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { Game } from '../models/game';
import { GameApiService } from '../services/game-api.service';

type ViewState =
  | { status: 'loading'; drafts: Game[] }
  | { status: 'loaded'; drafts: Game[] }
  | { status: 'error'; drafts: Game[]; message: string };

@Component({
  selector: 'app-draft-list',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe],
  template: `
    <div class="toolbar">
      <div>
        <h2>Draft overview</h2>
        <p>Live data streamed from the Rust backend.</p>
      </div>
      <button type="button" (click)="refresh()" [disabled]="refreshing()">
        {{ refreshing() ? 'Refreshing…' : 'Refresh list' }}
      </button>
    </div>

    <section class="board" *ngIf="vm$ | async as vm">
      <p class="empty" *ngIf="vm.status === 'loading'">Loading drafts…</p>
      <p class="empty error" *ngIf="vm.status === 'error'">{{ vm.message }}</p>
      <ng-container *ngIf="vm.status === 'loaded' && vm.drafts.length">
        <article *ngFor="let draft of vm.drafts">
          <header>
            <strong>{{ draft.title }}</strong>
            <span class="badge">#{{ draft.id }}</span>
          </header>
          <p>{{ draft.description }}</p>
          <footer>
            <span>Players:</span>
            <span>{{ draft.players.join(', ') || 'TBD' }}</span>
          </footer>
        </article>
      </ng-container>
      <p class="empty" *ngIf="vm.status === 'loaded' && !vm.drafts.length">
        No drafts available. Seed new ones via the API.
      </p>
    </section>
  `,
  styles: [
    `
    :host {
      display: block;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    button {
      border: none;
      border-radius: 999px;
      padding: 0.65rem 1.5rem;
      background: #fdbb2d;
      color: #1a1a1a;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      transition: transform 0.1s ease;
    }
    button:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    button:not(:disabled):active {
      transform: translateY(1px);
    }
    .board {
      display: grid;
      gap: 1rem;
    }
    article {
      padding: 1.25rem;
      border-radius: 1rem;
      background: rgba(19, 26, 59, 0.8);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.75rem;
      gap: 0.75rem;
    }
    .badge {
      font-size: 0.8rem;
      color: #f5f5f7;
      opacity: 0.75;
    }
    footer {
      display: flex;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: #c1c8ff;
    }
    .empty {
      text-align: center;
      color: #e6e6eb;
      font-style: italic;
    }
    .error {
      color: #ffb4b4;
    }
    `
  ]
})
export class DraftListComponent {
  private readonly refresh$ = new BehaviorSubject<void>(void 0);
  readonly vm$ = this.refresh$.pipe(
    switchMap(() =>
      this.api.listDrafts().pipe(
        map((drafts): ViewState => ({ status: 'loaded', drafts })),
        startWith<ViewState>({ status: 'loading', drafts: [] }),
        catchError(() =>
          of<ViewState>({
            status: 'error',
            drafts: [],
            message: 'Could not load drafts from the backend. Is it running?'
          })
        )
      )
    )
  );

  readonly refreshing = signal(false);

  constructor(private readonly api: GameApiService) {}

  refresh(): void {
    if (this.refreshing()) {
      return;
    }
    this.refreshing.set(true);
    queueMicrotask(() => {
      this.refresh$.next();
      setTimeout(() => this.refreshing.set(false), 250);
    });
  }
}

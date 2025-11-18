import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <section class="shell">
      <header>
        <h1>DraftGame Control Center</h1>
        <p>Angular 20 frontend talking to a Rust/Axum backend.</p>
        <nav>
          <a routerLink="/drafts" routerLinkActive="active">Drafts</a>
        </nav>
      </header>
      <router-outlet></router-outlet>
    </section>
  `,
  styles: [
    `
    :host {
      display: block;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: radial-gradient(circle at top, #1a2a6c, #b21f1f, #fdbb2d);
      min-height: 100vh;
      color: #f4f4f6;
    }
    .shell {
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      text-align: center;
      margin-bottom: 2rem;
    }
    header h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 0.5rem;
    }
    nav {
      margin-top: 1rem;
      display: inline-flex;
      gap: 1rem;
    }
    nav a {
      text-decoration: none;
      color: #f4f4f6;
      opacity: 0.75;
      border-bottom: 2px solid transparent;
      padding-bottom: 0.25rem;
    }
    nav a.active {
      opacity: 1;
      border-color: #fdbb2d;
    }
    `
  ]
})
export class AppComponent {}

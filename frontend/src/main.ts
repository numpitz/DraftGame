import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { DraftListComponent } from './app/components/draft-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'drafts', pathMatch: 'full' },
  { path: 'drafts', component: DraftListComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landingpage/landingpage.component')
        .then(m => m.LandingpageComponent)
  },
  {
    path: 'lifestyle',
    loadComponent: () =>
      import('./components/lifestyle/lifestyle.component')
        .then(m => m.LifestyleComponent)
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./components/report/report.component')
        .then(m => m.ReportComponent)
  }
];

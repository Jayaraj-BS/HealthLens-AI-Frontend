import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {

  constructor(private router: Router) { }

  scrollToDemo() {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  }

   gotoLifestyle() {
    this.router.navigate(['/lifestyle']);
  }

  gotoReports() {
    this.router.navigate(['/report']);
  }

  scrollToTools(){
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
  }
}

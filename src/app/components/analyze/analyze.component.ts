import { Component } from '@angular/core';
import { AnalyzeService } from '../../services/analyze.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AnalyzeComponent {

  shareableLink = '';
  carrier = 'Maersk';
  carrierETA = '';

  result: any = null;
  loading = false;

  carriers = [
    'Maersk',
    'MSC',
    'CMA CGM',
    'Hapag-Lloyd'
  ];

  constructor(private analyzeService: AnalyzeService) {}

  analyze() {

    if (!this.shareableLink || !this.carrierETA) {
      alert('Please fill all fields');
      return;
    }

    this.loading = true;

    this.analyzeService.analyze({
      shareableLink: this.shareableLink,
      carrier: this.carrier,
      carrierETA: this.carrierETA
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}

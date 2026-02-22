import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../helpers/loader/loader.component';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-lifestyle',
  standalone: true,
  templateUrl: './lifestyle.component.html',
  styleUrls: ['./lifestyle.component.css'],
  imports: [CommonModule, FormsModule, LoaderComponent]
})
export class LifestyleComponent {

  constructor(private http: HttpClient, private router: Router) { }

  // Backend URL (change when deployed)
  private baseUrl = 'http://localhost:3001';

  loading = false;

  form: any = {
    age: null,
    sleep: null,
    steps: null,
    water: null,
    junk: null,
    stress: null,
    exercise: null
  };

  result: any = null;

  analyze() {

    if (!this.isValid()) {
      alert('Please fill all fields properly.');
      return;
    }

    this.loading = true;
    this.result = null;

    this.http.post<any>(`${this.baseUrl}/health/lifestyle-risk`, this.form)
      .subscribe({
        next: (res) => {
          console.log(res, this.loading, "FIRST");

          // Map risk color for UI
          const riskColor = this.getRiskColor(res.riskLevel);

          this.result = {
            ...res,
            riskColor
          };

          this.loading = false;
          console.log(res, this.loading, "SECOND");

        },
        error: (err) => {
          console.error(err);
          alert('AI analysis failed. Please try again.');
          this.loading = false;
        }
      });
  }

  private getRiskColor(level: string): string {

    if (!level) return 'orange';

    const normalized = level.toLowerCase();

    if (normalized.includes('high')) return 'red';
    if (normalized.includes('moderate')) return 'orange';
    if (normalized.includes('low')) return 'green';

    return 'orange';
  }

  private isValid(): boolean {

    const values = Object.values(this.form);

    return values.every(v => v !== null && v !== undefined && v !== '');
  }

  gotoHome() {
    this.router.navigate(['/']);
  }

  exportLifestylePDF() {

    const doc = new jsPDF();
    let y = 20;

    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Logo
    const img = new Image();
    img.src = '/mainIcon.png';

    doc.addImage(img, 'PNG', pageWidth / 2 - 20, 10, 40, 20);
    y = 40;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Lifestyle Risk Analysis Report', pageWidth / 2, y, { align: 'center' });

    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' });

    y += 15;

    // Divider
    doc.line(10, y, pageWidth - 10, y);
    y += 10;

    // Risk Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Summary', 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Risk Score: ${this.result.riskScore}`, 10, y);
    y += 8;

    doc.text(`Risk Level: ${this.result.riskLevel}`, 10, y);
    y += 12;

    // Key Risks
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Risks', 10, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    this.result.keyRisks.forEach((risk: string) => {
      doc.text(`• ${risk}`, 15, y);
      y += 8;
    });

    y += 5;

    // Recommendations
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', 10, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    this.result.suggestions.forEach((s: string) => {
      doc.text(`• ${s}`, 15, y);
      y += 8;
    });

    y += 10;

     // Preventive Measures
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Preventive Measures', 10, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    this.result.preventiveAdvice.forEach((s: string) => {
      doc.text(`• ${s}`, 15, y);
      y += 8;
    });

    y += 10;

    // Disclaimer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(this.result.disclaimer, 10, y, { maxWidth: pageWidth - 20 });

    doc.save('HealthLens_Lifestyle_Report.pdf');
  }
}

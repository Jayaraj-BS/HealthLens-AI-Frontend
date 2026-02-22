import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../helpers/loader/loader.component';
import { environment } from '../../environments/environment';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  constructor(private http: HttpClient,
    private router: Router) { }

    private baseUrl = environment.apiUrl;

  reportText = '';
  loading = false;
  result: any = null;

  simplifyReport() {

    if (!this.reportText || this.reportText.length < 10) {
      alert('Please enter valid report text');
      return;
    }

    this.loading = true;
    this.result = null;

    this.http.post<any>(`${this.baseUrl}/health/simplify-report`, {
      report: this.reportText
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

  exportReportPDF() {

    const doc = new jsPDF();
    let y = 20;

    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo
    const img = new Image();
    img.src = '/mainIcon.png';

    doc.addImage(img, 'PNG', pageWidth / 2 - 20, 10, 40, 20);
    y = 40;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Medical Lab Report Analysis', pageWidth / 2, y, { align: 'center' });

    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' });

    y += 15;

    doc.line(10, y, pageWidth - 10, y);
    y += 15;

    // Overall Assessment
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Assessment', 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(this.result.overallAssessment, 10, y, { maxWidth: pageWidth - 20 });

    y += 20;

    doc.setFontSize(12);
    doc.text(`Severity Level: ${this.result.severity}`, 10, y);
    y += 8;

    doc.text(`Abnormal Markers: ${this.result.abnormalCount}`, 10, y);
    y += 15;

    // Markers Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Lab Markers', 10, y);
    y += 10;

    this.result.markers.forEach((marker: any) => {

      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`${marker.name} (${marker.status})`, 10, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Value: ${marker.value}`, 15, y);
      y += 8;

      doc.text(marker.explanation, 15, y, { maxWidth: pageWidth - 30 });
      y += 12;

      marker.lifestyleSuggestions.forEach((s: string) => {
        doc.text(`• ${s}`, 20, y);
        y += 8;
      });

      y += 10;
    });

    // Doctor Questions
    doc.addPage();
    y = 20;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Questions for Doctor', 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    this.result.doctorQuestions.forEach((q: string) => {
      doc.text(`• ${q}`, 15, y);
      y += 8;
    });

    y += 15;

    // Disclaimer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(this.result.disclaimer, 10, y, { maxWidth: pageWidth - 20 });

    doc.save('HealthLens_Medical_Report.pdf');
  }

  gotoHome() {
    this.router.navigate(['/']);
  }
}

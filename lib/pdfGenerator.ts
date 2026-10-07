import { jsPDF } from 'jspdf';

export interface PDFOptions {
  certificateId: string;
  subjectName: string;
  course: string;
  cgpa: string;
  organizationName: string;
  issueDate: string;
  isTampered?: boolean;
  tamperedCgpa?: string;
  tamperedName?: string;
}

/**
 * Generates an official PDF certificate with embedded VeriChain security watermarks.
 * Can generate either an authentic certificate or an intentionally tampered certificate.
 */
export function generateCertificatePDF(options: PDFOptions): Buffer {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background frame
  doc.setLineWidth(2);
  doc.setDrawColor(2, 132, 199); // Blue border
  doc.rect(8, 8, width - 16, height - 16);

  doc.setLineWidth(0.5);
  doc.setDrawColor(148, 163, 184); // Inner subtle border
  doc.rect(12, 12, width - 24, height - 24);

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(options.organizationName.toUpperCase(), width / 2, 30, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("OFFICIAL ACADEMIC & RECORD CERTIFICATE", width / 2, 38, { align: "center" });

  // Divider
  doc.setLineWidth(0.8);
  doc.setDrawColor(2, 132, 199);
  doc.line(60, 44, width - 60, 44);

  // Body content
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text("This is to certify that", width / 2, 58, { align: "center" });

  // Recipient Name
  const displayName = options.isTampered && options.tamperedName ? options.tamperedName : options.subjectName;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(options.isTampered && options.tamperedName ? 225 : 2, options.isTampered && options.tamperedName ? 29 : 132, options.isTampered && options.tamperedName ? 72 : 199);
  doc.text(displayName, width / 2, 70, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("has successfully completed the degree program for", width / 2, 82, { align: "center" });

  // Course Name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(options.course, width / 2, 92, { align: "center" });

  // CGPA / Performance
  const displayCgpa = options.isTampered && options.tamperedCgpa ? options.tamperedCgpa : options.cgpa;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(options.isTampered && options.tamperedCgpa ? 220 : 15, options.isTampered && options.tamperedCgpa ? 38 : 23, options.isTampered && options.tamperedCgpa ? 38 : 42);
  doc.text(`Cumulative Grade Point Average (CGPA): ${displayCgpa}`, width / 2, 104, { align: "center" });

  // Metadata Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Certificate Record ID: ${options.certificateId}`, 20, 135);
  doc.text(`Issue Date: ${options.issueDate}`, 20, 142);

  // Security & Blockchain Watermark
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("VERICHAIN BLOCKCHAIN PROTECTED RECORD • SHA-256 INTEGRITY ANCHORED", width / 2, 165, { align: "center" });

  if (options.isTampered) {
    // Watermark tag for internal test tracking
    doc.setFontSize(9);
    doc.setTextColor(220, 38, 38);
    doc.text("[TAMPERED TEST FILE - HASH ALTERED]", width / 2, 172, { align: "center" });
  }

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

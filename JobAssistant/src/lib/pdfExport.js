import { jsPDF } from 'jspdf';

function sanitize(s) {
  return s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function buildResumeFilename({ resumeLabel, jobTitle }) {
  const date = new Date().toISOString().slice(0, 10);
  const namePart =
    resumeLabel && resumeLabel !== 'Custom Info'
      ? sanitize(resumeLabel.replace(/\.pdf$/i, '')) || 'Resume'
      : 'Resume';
  const rolePart = jobTitle ? sanitize(jobTitle).slice(0, 40) : 'Tailored';
  return `${namePart}-${rolePart}-${date}.pdf`;
}

export function downloadResumePdf(text, filename) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const marginX = 54;
  const marginY = 54;
  const lineHeight = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont('helvetica');
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
  let y = marginY;
  for (const line of lines) {
    if (y > pageHeight - marginY) {
      doc.addPage();
      y = marginY;
    }
    doc.text(line, marginX, y);
    y += lineHeight;
  }

  doc.save(filename);
}

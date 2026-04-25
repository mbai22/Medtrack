import jsPDF from 'jspdf';

/**
 * Génère une ordonnance PDF pour une consultation
 */
export const generateOrdonnancePDF = (patient, consultation, doctor = null) => {
  const doc = new jsPDF();
  
  // Configuration des couleurs
  const primaryColor = [15, 23, 42]; // #0F172A
  const accentColor = [16, 185, 129]; // #10B981
  
  // En-tête
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Ordonnance', 105, 25, { align: 'center' });
  
  // Informations du médecin
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  if (doctor) {
    doc.text(`Dr. ${doctor.prenom} ${doctor.nom}`, 20, 55);
    doc.text(`${doctor.specialite}`, 20, 62);
    doc.text(`RPPS: ${doctor.rpps}`, 20, 69);
    doc.text(`Tél: ${doctor.telephone}`, 20, 76);
  } else {
    doc.text('Dr. Dupont', 20, 55);
    doc.text('Médecin Généraliste', 20, 62);
    doc.text('Tél: 01 23 45 67 89', 20, 69);
  }
  
  // Date
  const date = new Date(consultation.date);
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Date: ${dateStr}`, 150, 55);
  
  // Ligne de séparation
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 85, 190, 85);
  
  // Informations du patient
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient', 20, 100);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom: ${patient.nom}`, 20, 110);
  doc.text(`Prénom: ${patient.prenom}`, 20, 117);
  doc.text(`Date de naissance: ${new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}`, 20, 124);
  doc.text(`Téléphone: ${patient.telephone}`, 20, 131);
  doc.text(`Lieu: ${patient.lieu}`, 20, 138);
  
  // Ligne de séparation
  doc.line(20, 145, 190, 145);
  
  // Diagnostic
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnostic', 20, 160);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const diagnosticLines = doc.splitTextToSize(consultation.diagnostic, 170);
  doc.text(diagnosticLines, 20, 170);
  
  let yPos = 170 + (diagnosticLines.length * 7);
  
  // Traitement / Ordonnance
  if (consultation.traitement) {
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Traitement prescrit', 20, yPos);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const traitementLines = doc.splitTextToSize(consultation.traitement, 170);
    doc.text(traitementLines, 20, yPos + 10);
    
    yPos += 10 + (traitementLines.length * 7);
  }
  
  // Examens demandés
  if (consultation.examens) {
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Examens demandés', 20, yPos);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const examensLines = doc.splitTextToSize(consultation.examens, 170);
    doc.text(examensLines, 20, yPos + 10);
    
    yPos += 10 + (examensLines.length * 7);
  }
  
  // Notes supplémentaires
  if (consultation.notes) {
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', 20, yPos);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(consultation.notes, 170);
    doc.text(notesLines, 20, yPos + 10);
  }
  
  // Pied de page
  doc.setFillColor(...accentColor);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('MediTrack - Gestion des Patients', 105, 290, { align: 'center' });
  
  // Sauvegarde du PDF
  const fileName = `ordonnance_${patient.nom}_${patient.prenom}_${dateStr.replace(/\s/g, '_')}.pdf`;
  doc.save(fileName);
};

/**
 * Génère un récapitulatif patient PDF
 */
export const generatePatientSummaryPDF = (patient, consultations) => {
  const doc = new jsPDF();
  
  const primaryColor = [15, 23, 42];
  const accentColor = [16, 185, 129];
  
  // En-tête
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Dossier Patient', 105, 25, { align: 'center' });
  
  // Informations du patient
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${patient.prenom} ${patient.nom}`, 20, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date de naissance: ${new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}`, 20, 65);
  doc.text(`Sexe: ${patient.sexe}`, 20, 72);
  doc.text(`Téléphone: ${patient.telephone}`, 20, 79);
  doc.text(`Lieu: ${patient.lieu}`, 20, 86);
  doc.text(`Profession: ${patient.profession || 'Non renseigné'}`, 20, 93);
  doc.text(`Groupe sanguin: ${patient.groupeSanguin}`, 20, 100);
  doc.text(`Statut: ${patient.statut}`, 20, 107);
  
  // Allergies
  if (patient.allergies) {
    doc.setFont('helvetica', 'bold');
    doc.text('Allergies:', 20, 120);
    doc.setFont('helvetica', 'normal');
    const allergiesLines = doc.splitTextToSize(patient.allergies, 170);
    doc.text(allergiesLines, 20, 127);
  }
  
  // Antécédents
  if (patient.antecedents) {
    doc.setFont('helvetica', 'bold');
    doc.text('Antécédents médicaux:', 20, 145);
    doc.setFont('helvetica', 'normal');
    const antecedentsLines = doc.splitTextToSize(patient.antecedents, 170);
    doc.text(antecedentsLines, 20, 152);
  }
  
  // Historique des consultations
  doc.setFont('helvetica', 'bold');
  doc.text('Historique des consultations', 20, 175);
  
  doc.setFont('helvetica', 'normal');
  let yPos = 185;
  
  consultations.slice(0, 10).forEach((consultation, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    const date = new Date(consultation.date).toLocaleDateString('fr-FR');
    doc.setFont('helvetica', 'bold');
    doc.text(`${date} - ${consultation.motif}`, 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Diagnostic: ${consultation.diagnostic}`, 20, yPos + 7);
    
    if (consultation.traitement) {
      const traitementLines = doc.splitTextToSize(consultation.traitement, 170);
      doc.text(traitementLines, 20, yPos + 14);
      yPos += 7 + (traitementLines.length * 5);
    } else {
      yPos += 14;
    }
    
    yPos += 10;
  });
  
  // Pied de page
  doc.setFillColor(...accentColor);
  doc.rect(0, 280, 210, 17, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('MediTrack - Gestion des Patients', 105, 290, { align: 'center' });
  
  const fileName = `dossier_${patient.nom}_${patient.prenom}.pdf`;
  doc.save(fileName);
};

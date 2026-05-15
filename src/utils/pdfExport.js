import { jsPDF } from 'jspdf';

export const exportPatientPDF = (patient, consultations, vitalSigns) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const title = (text) => {
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
    y += 10;
  };

  const section = (text) => {
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text(text, 20, y);
    y += 8;
    doc.setDrawColor(16, 185, 129);
    doc.line(20, y, pageWidth - 20, y);
    y += 6;
  };

  const field = (label, value) => {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(label, 20, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(value || '-', 80, y);
    doc.setFont('helvetica', 'normal');
    y += 6;
  };

  const age = (birthDate) => {
    if (!birthDate) return '-';
    const diff = new Date() - new Date(birthDate);
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  title('Dossier Médical - MediTrack');

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth / 2, y, { align: 'center' });
  y += 15;

  section('Informations patient');
  field('Nom complet', `${patient.prenom} ${patient.nom}`);
  field('Date naissance', patient.dateNaissance || patient.date_naissance || '-');
  field('Âge', `${age(patient.dateNaissance || patient.date_naissance)} ans`);
  field('Sexe', patient.sexe || '-');
  field('Téléphone', patient.telephone || '-');
  field('Lieu', patient.lieu || '-');
  field('Profession', patient.profession || '-');
  field('Groupe sanguin', patient.groupeSanguin || patient.groupe_sanguin || '-');
  field('Statut', patient.statut || 'Actif');

  y += 5;
  section('Antécédents médicaux');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(patient.antecedents || patient.antecedents || 'Aucun', 20, y, { maxWidth: pageWidth - 40 });
  y += 10;

  section('Allergies');
  doc.text(patient.allergies || patient.allergies || 'Aucune', 20, y, { maxWidth: pageWidth - 40 });
  y += 15;

  if (consultations && consultations.length > 0) {
    if (y > 220) { doc.addPage(); y = 20; }
    section('Historique des consultations');
    for (const c of consultations) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFillColor(249, 250, 251);
      doc.rect(20, y, pageWidth - 40, 8, 'F');
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      const d = new Date(c.date);
      doc.text(`${d.toLocaleDateString('fr-FR')} - ${c.motif}`, 22, y + 6);
      doc.setFont('helvetica', 'normal');
      y += 12;

      if (c.diagnostic) {
        doc.setTextColor(100);
        doc.text('Diagnostic:', 22, y);
        doc.setTextColor(15, 23, 42);
        doc.text(c.diagnostic, 60, y);
        y += 6;
      }
      if (c.traitement) {
        doc.setTextColor(100);
        doc.text('Traitement:', 22, y);
        doc.setTextColor(15, 23, 42);
        doc.text(c.traitement, 60, y);
        y += 6;
      }
      if (c.symptomes) {
        doc.setTextColor(100);
        doc.text('Symptômes:', 22, y);
        doc.setTextColor(15, 23, 42);
        doc.text(c.symptomes, 60, y);
        y += 6;
      }
      y += 4;
    }
  }

  if (vitalSigns && vitalSigns.length > 0) {
    if (y > 220) { doc.addPage(); y = 20; }
    section('Constantes vitales');
    for (const v of vitalSigns.slice(-5).reverse()) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text(new Date(v.date).toLocaleDateString('fr-FR'), 22, y += 6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      if (v.tension) doc.text(`TA: ${v.tension}`, 80, y);
      if (v.pouls) doc.text(`Pouls: ${v.pouls}`, 140, y);
      if (v.temperature) doc.text(`T°: ${v.temperature}°C`, 22, y += 6);
      if (v.poids) doc.text(`Poids: ${v.poids} kg`, 80, y);
      if (v.taille) doc.text(`Taille: ${v.taille} cm`, 140, y);
      y += 4;
    }
  }

  doc.save(`dossier_${patient.nom}_${patient.prenom}.pdf`);
};

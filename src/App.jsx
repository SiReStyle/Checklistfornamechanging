import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const checklistItems = [
  { title: "Ausweis und Reisepass", description: "Neue Dokumente beim Bürgerbüro beantragen: alter Ausweis, Passfoto, Nachweis mitbringen." },
  { title: "Führerschein und Fahrzeugpapiere", description: "Führerschein & Fahrzeugbrief/-schein bei der Zulassungsstelle umschreiben lassen." },
  { title: "Versicherungen", description: "Kfz-, Kranken-, Haftpflicht-, Lebensversicherungen und Rentenkasse informieren." },
  { title: "Banken und Finanzen", description: "Bank, Kreditkarten, PayPal, Amazon, Daueraufträge etc. aktualisieren." },
  { title: "Verträge und Mitgliedschaften", description: "Handy, Strom, Internet, Streamingdienste und Mitgliedschaften anpassen." },
  { title: "Post und Behörden", description: "Finanzamt, GEZ, Agentur für Arbeit informieren (oft automatisch mit Ausweisänderung)." },
  { title: "Berufliches und Soziales", description: "Arbeitgeber, Rentenkonto, Berufskammern, Schulen, Kitas informieren." },
  { title: "Digitales Leben", description: "E-Mail-Adressen, Social Media, Kundenkonten (z. B. Zalando, eBay) anpassen." },
  { title: "Für deinen Hund Pepper", description: "Namensänderung bei Stadt (Hundesteuer), Tierarzt, Versicherung, Hundeschule mitteilen." },
  { title: "Tipp: Dokumentenmappe anlegen", description: "Heiratsurkunde, Ausweise, Liste aller Stellen als Mappe vorbereiten." },
];

export default function NamensCheckliste() {
  const [checked, setChecked] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("checklist_state");
      return stored ? JSON.parse(stored) : Array(checklistItems.length).fill(false);
    }
    return Array(checklistItems.length).fill(false);
  });

  useEffect(() => {
    localStorage.setItem("checklist_state", JSON.stringify(checked));
  }, [checked]);

  const toggleCheck = (index) => {
    const updated = [...checked];
    updated[index] = !updated[index];
    setChecked(updated);
    if (updated[index]) {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const progress = (checked.filter(Boolean).length / checklistItems.length) * 100;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>📝 Namensänderung-Checkliste</h1>
      <progress value={progress} max="100" style={{ width: '100%', height: '1rem', marginBottom: '1rem' }} />
      <p style={{ textAlign: 'center' }}>{Math.round(progress)}% erledigt</p>
      {checklistItems.map((item, index) => (
        <label key={index} style={{ display: 'block', background: '#f9f9f9', marginBottom: '1rem', padding: '1rem', borderRadius: '8px' }}>
          <input
            type="checkbox"
            checked={checked[index]}
            onChange={() => toggleCheck(index)}
            style={{ marginRight: '0.5rem' }}
          />
          <strong>{item.title}</strong>
          <p style={{ margin: '0.5rem 0 0 1.5rem', fontSize: '0.9rem', color: '#555' }}>{item.description}</p>
        </label>
      ))}
    </div>
  );
}

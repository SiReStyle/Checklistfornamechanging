import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const defaultChecklist = [
  { title: "Ausweis und Reisepass", description: "Neue Dokumente beim Bürgerbüro beantragen: alter Ausweis, Passfoto, Nachweis mitbringen.", subtasks: ["Bürgerbüro-Termin buchen"] },
  { title: "Führerschein und Fahrzeugpapiere", description: "Führerschein & Fahrzeugbrief/-schein bei der Zulassungsstelle umschreiben lassen.", subtasks: ["Zulassungsstelle Termin buchen"] },
  { title: "Versicherungen", description: "Alle Versicherungen informieren.", subtasks: ["Krankenkasse", "KFZ-Versicherung", "Haftpflichtversicherung", "Lebensversicherung", "Rentenversicherung"] },
  { title: "Banken und Finanzen", description: "Bank, Kreditkarten, PayPal, Amazon, Daueraufträge etc. aktualisieren.", subtasks: ["Hausbank", "Kreditkartenanbieter", "Online-Dienste (z. B. PayPal)"] },
  { title: "Verträge und Mitgliedschaften", description: "Handy, Strom, Internet, Streamingdienste und Mitgliedschaften anpassen.", subtasks: ["Mobilfunkanbieter", "Stromanbieter", "Streamingdienste"] },
  { title: "Post und Behörden", description: "Finanzamt, GEZ informieren (oft automatisch mit Ausweisänderung).", subtasks: ["Finanzamt", "Rundfunkbeitrag"] },
  { title: "Berufliches und Soziales", description: "Arbeitgeber, Rentenkonto, Berufskammern informieren.", subtasks: ["Arbeitgeber", "Berufskammer"] },
  { title: "Digitales Leben", description: "E-Mail-Adressen, Social Media, Kundenkonten (z. B. Zalando, eBay) anpassen.", subtasks: ["E-Mail-Adressen", "Online-Shops", "Soziale Netzwerke"] },
  { title: "Für deinen Hund Pepper", description: "Namensänderung bei Stadt (Hundesteuer), Tierarzt, Versicherung mitteilen.", subtasks: ["Stadtverwaltung", "Tierarzt", "Versicherung"] },
  { title: "Tipp: Dokumentenmappe anlegen", description: "Heiratsurkunde, Ausweise, Liste aller Stellen als Mappe vorbereiten.", subtasks: [] }
];

export default function NamensCheckliste() {
  const [checklistItems, setChecklistItems] = useState(() => {
    const stored = localStorage.getItem("custom_checklist");
    return stored ? JSON.parse(stored) : defaultChecklist;
  });

  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem("checked_state");
    return saved ? JSON.parse(saved) : defaultChecklist.map(item => item.subtasks.map(() => false));
  });

  const [termine, setTermine] = useState(() => {
    const saved = localStorage.getItem("termine_state");
    return saved ? JSON.parse(saved) : {};
  });

  const [notizen, setNotizen] = useState(() => {
    const saved = localStorage.getItem("notizen_state");
    return saved ? JSON.parse(saved) : defaultChecklist.map(() => []);
  });

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const now = new Date();
    Object.entries(termine).forEach(([key, value]) => {
      const match = value.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
      if (match) {
        const [, day, month, year, hour, minute] = match;
        const reminderTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
        const delay = reminderTime.getTime() - now.getTime();
        if (delay > 0) {
          setTimeout(() => {
            new Notification('📌 Termin-Erinnerung', { body: `Erinnerung: ${key} ist jetzt!`, icon: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' });
          }, delay);
        }
      }
    });
  }, [termine]);

  const handleCheck = (i, j) => {
    const updated = [...checked];
    updated[i][j] = !updated[i][j];
    setChecked(updated);
    localStorage.setItem("checked_state", JSON.stringify(updated));
    if (updated[i].every(Boolean)) confetti();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📝 Checkliste zur Namensänderung</h1>
      {checklistItems.map((item, i) => (
        <div key={i} style={{ marginBottom: "2rem", padding: "1rem", background: "#fdf6f6", borderRadius: "12px" }}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <ul>
            {item.subtasks.map((sub, j) => (
              <li key={j}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked[i][j]}
                    onChange={() => handleCheck(i, j)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {sub}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

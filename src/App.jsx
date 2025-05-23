import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const defaultChecklist = [
  {
    title: "Ausweis und Reisepass",
    description: "Neue Dokumente beim Bürgerbüro beantragen: alter Ausweis, Passfoto, Nachweis mitbringen.",
    subtasks: ["Bürgerbüro-Termin buchen"]
  },
  {
    title: "Führerschein und Fahrzeugpapiere",
    description: "Führerschein & Fahrzeugbrief/-schein bei der Zulassungsstelle umschreiben lassen.",
    subtasks: ["Zulassungsstelle Termin buchen"]
  },
  {
    title: "Versicherungen",
    description: "Alle Versicherungen informieren.",
    subtasks: ["Krankenkasse", "KFZ-Versicherung", "Haftpflichtversicherung", "Lebensversicherung", "Rentenversicherung"]
  },
  {
    title: "Banken und Finanzen",
    description: "Bank, Kreditkarten, PayPal, Amazon, Daueraufträge etc. aktualisieren.",
    subtasks: ["Hausbank", "Kreditkartenanbieter", "Online-Dienste (z. B. PayPal)"]
  },
  {
    title: "Verträge und Mitgliedschaften",
    description: "Handy, Strom, Internet, Streamingdienste und Mitgliedschaften anpassen.",
    subtasks: ["Mobilfunkanbieter", "Stromanbieter", "Streamingdienste"]
  },
  {
    title: "Post und Behörden",
    description: "Finanzamt, GEZ informieren (oft automatisch mit Ausweisänderung).",
    subtasks: ["Finanzamt", "Rundfunkbeitrag"]
  },
  {
    title: "Berufliches und Soziales",
    description: "Arbeitgeber, Rentenkonto, Berufskammern informieren.",
    subtasks: ["Arbeitgeber", "Berufskammer"]
  },
  {
    title: "Digitales Leben",
    description: "E-Mail-Adressen, Social Media, Kundenkonten (z. B. Zalando, eBay) anpassen.",
    subtasks: ["E-Mail-Adressen", "Online-Shops", "Soziale Netzwerke"]
  },
  {
    title: "Für deinen Hund Pepper",
    description: "Namensänderung bei Stadt (Hundesteuer), Tierarzt, Versicherung mitteilen.",
    subtasks: ["Stadtverwaltung", "Tierarzt", "Versicherung"]
  },
  {
    title: "Tipp: Dokumentenmappe anlegen",
    description: "Heiratsurkunde, Ausweise, Liste aller Stellen als Mappe vorbereiten.",
    subtasks: []
  },
];

export default function NamensCheckliste() {
  const storedCustom = localStorage.getItem("custom_checklist");
  const checklistItems = storedCustom ? JSON.parse(storedCustom) : defaultChecklist;
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem("checked_state");
    return saved ? JSON.parse(saved) : checklistItems.map(item => item.subtasks.map(() => false));
  });

  const [termine, setTermine] = useState(() => {
    const saved = localStorage.getItem("termine_state");
    return saved ? JSON.parse(saved) : checklistItems.map(() => "");
  });

  const [notizen, setNotizen] = useState(() => {
    const saved = localStorage.getItem("notizen_state");
    return saved ? JSON.parse(saved) : checklistItems.map(() => []);
  });

  useEffect(() => {
    const reminders = termine.filter(Boolean);
    reminders.forEach((entry, i) => {
      if (entry.toLowerCase().includes("morgen")) {
        const title = checklistItems[i].title;
        setTimeout(() => {
          alert(`🔔 Erinnerung: Termin für '${title}' steht morgen an!`);
        }, 2000);
      }
    });
  }, [termine]);

  const toggleCheck = (itemIdx, subIdx) => {
    const updated = [...checked];
    updated[itemIdx][subIdx] = !updated[itemIdx][subIdx];
    setChecked(updated);
    localStorage.setItem("checked_state", JSON.stringify(updated));
    if (updated[itemIdx][subIdx]) {
      const allDone = updated.flat().every(Boolean);
      if (allDone) {
        const audio = new Audio("https://freesound.org/data/previews/341/341695_5260877-lq.mp3");
        audio.play();
        alert("🎉 Alles erledigt – du bist durch! Zeit für Sekt!");
      }
      const isPepperTask = checklistItems[itemIdx].title.includes("Pepper");
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: isPepperTask ? ['#ff69b4', '#ffd700'] : undefined
      });
      if (isPepperTask) {
        alert("🐶 Pepper sagt: Gut gemacht!");
      }
    }
  };

  const handleTerminChange = (index, value) => {
    const updated = [...termine];
    updated[index] = value;
    setTermine(updated);
    localStorage.setItem("termine_state", JSON.stringify(updated));
    localStorage.setItem("termine_state", JSON.stringify(updated));
  };

  const handleDownloadPDF = () => {
    const content = document.getElementById("checkliste-root");
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Checkliste PDF</title></head><body>');
    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div id="checkliste-root" style={{ maxWidth: '700px', margin: '2rem auto', background: '#e1f5fe', padding: '1rem', borderRadius: '1rem' }}>
      <h1 style={{ textAlign: 'center', color: '#bf360c' }}>📋 Namensänderung-Checkliste</h1>
      {checklistItems.map((item, i) => (
        <div key={i} style={{ position: 'relative', marginBottom: '2rem', padding: '1rem', background: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: `hsl(${i * 36}, 70%, 45%)`, fontWeight: 'bold' }}>{item.title}
            {storedCustom && checklistItems.length > defaultChecklist.length && i >= defaultChecklist.length && (
              <button
                onClick={() => {
                  const updatedItems = checklistItems.filter((_, idx) => idx !== i);
                  const updatedChecked = checked.filter((_, idx) => idx !== i);
                  const updatedTermine = termine.filter((_, idx) => idx !== i);
                  const updatedNotizen = notizen.filter((_, idx) => idx !== i);
                  localStorage.setItem("custom_checklist", JSON.stringify(updatedItems));
                  localStorage.setItem("checked_state", JSON.stringify(updatedChecked));
                  localStorage.setItem("termine_state", JSON.stringify(updatedTermine));
                  localStorage.setItem("notizen_state", JSON.stringify(updatedNotizen));
                  window.location.reload();
                }}
                style={{
                  marginLeft: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.color = '#f28b82'}
                onMouseOut={(e) => e.target.style.color = '#888'}
              >
                ❌
              </button>
            )}</h2>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Titel:<br />
          <input type="text" id="custom-title" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Beschreibung:<br />
          <input type="text" id="custom-desc" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Unterpunkte (durch Kommas trennen):<br />
          <input type="text" id="custom-subtasks" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <button onClick={() => {
          const title = document.getElementById("custom-title").value;
          const desc = document.getElementById("custom-desc").value;
          const subtasks = document.getElementById("custom-subtasks").value.split(',').map(s => s.trim()).filter(Boolean);
          if (!title) return;
          const newItem = { title, description: desc, subtasks };
          checklistItems.push(newItem);
          localStorage.setItem("custom_checklist", JSON.stringify(checklistItems));
          setChecked([...checked, subtasks.map(() => false)]);
          setTermine([...termine, ""]);
          document.getElementById("custom-title").value = "";
          document.getElementById("custom-desc").value = "";
          document.getElementById("custom-subtasks").value = "";
        }} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#ba68c8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ➕ Hinzufügen
        </button>
      </div>
          <div style={{ marginTop: '3rem', padding: '1rem', borderTop: '2px solid #ccc' }}>
        <h2 style={{ color: '#6a1b9a' }}>🆕 Eigene Aufgabe hinzufügen</h2>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Titel:<br />
          <input type="text" id="custom-title" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Beschreibung:<br />
          <input type="text" id="custom-desc" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Unterpunkte (durch Kommas trennen):<br />
          <input type="text" id="custom-subtasks" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <button onClick={() => {
          const title = document.getElementById("custom-title").value;
          const desc = document.getElementById("custom-desc").value;
          const subtasks = document.getElementById("custom-subtasks").value.split(',').map(s => s.trim()).filter(Boolean);
          if (!title) return;
          const newItem = { title, description: desc, subtasks };
          checklistItems.push(newItem);
          localStorage.setItem("custom_checklist", JSON.stringify(checklistItems));
          setChecked([...checked, subtasks.map(() => false)]);
          setTermine([...termine, ""]);
          document.getElementById("custom-title").value = "";
          document.getElementById("custom-desc").value = "";
          document.getElementById("custom-subtasks").value = "";
        }} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#ba68c8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ➕ Hinzufügen
        </button>
      </div>
    </div>
  );
}

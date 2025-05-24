import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const defaultChecklist = [
  { title: "Ausweis und Reisepass", description: "Neue Dokumente beim Bürgerbüro beantragen.", subtasks: ["Bürgerbüro-Termin buchen"], note: "", date: "" },
  { title: "Führerschein und Fahrzeugpapiere", description: "Führerschein & Fahrzeugbrief/-schein bei der Zulassungsstelle umschreiben lassen.", subtasks: ["Zulassungsstelle Termin buchen"], note: "", date: "" },
  { title: "Versicherungen", description: "Alle Versicherungen informieren.", subtasks: ["Krankenkasse", "KFZ-Versicherung", "Haftpflichtversicherung", "Lebensversicherung", "Rentenversicherung"], note: "", date: "" },
  { title: "Banken und Finanzen", description: "Bank, Kreditkarten, PayPal, Amazon, Daueraufträge etc. aktualisieren.", subtasks: ["Hausbank", "Kreditkartenanbieter", "Online-Dienste (z. B. PayPal)"], note: "", date: "" },
  { title: "Verträge und Mitgliedschaften", description: "Handy, Strom, Internet, Streamingdienste und Mitgliedschaften anpassen.", subtasks: ["Mobilfunkanbieter", "Stromanbieter", "Streamingdienste"], note: "", date: "" },
  { title: "Post und Behörden", description: "Finanzamt, GEZ informieren (oft automatisch mit Ausweisänderung).", subtasks: ["Finanzamt", "Rundfunkbeitrag"], note: "", date: "" },
  { title: "Berufliches und Soziales", description: "Arbeitgeber, Rentenkonto, Berufskammern informieren.", subtasks: ["Arbeitgeber", "Berufskammer"], note: "", date: "" },
  { title: "Digitales Leben", description: "E-Mail-Adressen, Social Media, Kundenkonten (z. B. Zalando, eBay) anpassen.", subtasks: ["E-Mail-Adressen", "Online-Shops", "Soziale Netzwerke"], note: "", date: "" },
  { title: "Für deinen Hund Pepper", description: "Namensänderung bei Stadt, Tierarzt, Versicherung.", subtasks: ["Stadtverwaltung", "Tierarzt", "Versicherung"], note: "", date: "" },
  { title: "Tipp: Dokumentenmappe anlegen", description: "Heiratsurkunde, Ausweise, Liste aller Stellen als Mappe vorbereiten.", subtasks: [], note: "", date: "" }
];

export default function NamensCheckliste() {
  const [checklistItems, setChecklistItems] = useState(() => {
    const stored = localStorage.getItem("custom_checklist");
    return stored ? JSON.parse(stored) : defaultChecklist;
  });
  const [deletedItems, setDeletedItems] = useState([]);

  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem("checked_state");
    return saved ? JSON.parse(saved) : defaultChecklist.map(item => item.subtasks.map(() => false));
  });

  useEffect(() => {
    localStorage.setItem("custom_checklist", JSON.stringify(checklistItems));
  }, [checklistItems]);

  useEffect(() => {
    localStorage.setItem("checked_state", JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    checklistItems.forEach((item) => {
      if (!item.date) return;
      const [year, month, day] = item.date.split("-");
      const reminderTime = new Date(`${year}-${month}-${day}T09:00:00`); // Erinnerung 9 Uhr
      const delay = reminderTime.getTime() - new Date().getTime();
      if (delay > 0) {
        setTimeout(() => {
          new Notification('🗓️ Erinnerung', {
            body: `Heute steht an: ${item.title}`,
          });
        }, delay);
      }
    });
  }, [checklistItems]);

  const handleNoteChange = (index, value) => {
    const updated = [...checklistItems];
    updated[index].note = value;
    setChecklistItems(updated);
  };

  const handleDateChange = (index, value) => {
    const updated = [...checklistItems];
    updated[index].date = value;
    setChecklistItems(updated);
  };

  const getProgress = () => {
    const totalTasks = checked.reduce((sum, group) => sum + group.length, 0);
    const doneTasks = checked.reduce((sum, group) => sum + group.filter(Boolean).length, 0);
    return totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= checklistItems.length) return;
    const newItems = [...checklistItems];
    const newChecked = [...checked];
    const [movedItem] = newItems.splice(fromIndex, 1);
    const [movedChecked] = newChecked.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    newChecked.splice(toIndex, 0, movedChecked);
    setChecklistItems(newItems);
    setChecked(newChecked);
  };

  const addTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const newTitle = form.title.value.trim();
    const newDescription = form.description.value.trim();
    const subtasks = Array.from(form.querySelectorAll('.subtask-input')).map(i => i.value.trim()).filter(Boolean);
    if (!newTitle || !newDescription) return;
    const newItem = { title: newTitle, description: newDescription, subtasks, note: '', date: '' };
    setChecklistItems([...checklistItems, newItem]);
    setChecked([...checked, subtasks.map(() => false)]);
    form.reset();
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: 'linear-gradient(to right, #fdfbfb, #ebedee)', color: '#333', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧾 Namensänderung Checkliste</h1>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Fortschritt:</strong> {getProgress()}%
        <div style={{ height: '10px', background: '#ddd', borderRadius: '5px', overflow: 'hidden', marginTop: '5px' }}>
          <div style={{ width: `${getProgress()}%`, height: '10px', background: '#4caf50' }}></div>
        </div>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {checklistItems.map((item, index) => (
          <li key={index} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '0.25rem' }}>{item.title} <button onClick={() => {
              if (window.confirm('Willst du diese Aufgabe wirklich löschen?')) {
                const updatedItems = [...checklistItems];
                const updatedChecked = [...checked];
                updatedItems.splice(index, 1);
                updatedChecked.splice(index, 1);
                setChecklistItems(updatedItems);
                setChecked(updatedChecked);
                setDeletedItems([...deletedItems, checklistItems[index]]);
              }
            }} style={{ marginLeft: '10px' }}>🗑️</button></h2>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{item.description}</p>
            <div style={{ marginBottom: '0.5rem' }}>
              <label>📅 Termin: <input type="date" value={item.date || ""} onChange={(e) => handleDateChange(index, e.target.value)} /></label>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label>📝 Notiz: <input type="text" value={item.note || ""} onChange={(e) => handleNoteChange(index, e.target.value)} style={{ width: '100%' }} /></label>
            </div>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {item.subtasks.map((sub, i) => (
                <li key={i}>
                  <label>
                    <input
                      type="checkbox"
                      style={{ marginRight: '8px' }}
                      checked={checked[index]?.[i] || false}
                      onChange={() => {
                        const newChecked = [...checked];
                        newChecked[index][i] = !newChecked[index][i];
                        setChecked(newChecked);
                        if (newChecked[index].every(Boolean)) {
                          if (window.confirm('Alle Unteraufgaben erledigt – Konfetti? 🎉')) {
                            confetti();
                          }
                        }
                      }}
                    />
                    {sub}
                  </label>
                    <button onClick={() => moveItem(index, index - 1)} style={{ marginLeft: '10px' }}>🔼</button>
                    <button onClick={() => moveItem(index, index + 1)} style={{ marginLeft: '5px' }}>🔽</button>
                  </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <hr style={{ margin: '2rem 0' }} />
      <h2>➕ Neue Aufgabe hinzufügen</h2>
      <form onSubmit={addTask} style={{ marginBottom: '2rem' }}>
        <input type="text" name="title" placeholder="Titel" required style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <textarea name="description" placeholder="Beschreibung" required style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <div id="subtasks-container">
          <input type="text" className="subtask-input" placeholder="Unteraufgabe 1" style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        </div>
        <button type="button" onClick={() => {
          const container = document.getElementById('subtasks-container');
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'Weitere Unteraufgabe';
          input.className = 'subtask-input';
          input.style.display = 'block';
          input.style.marginBottom = '0.5rem';
          input.style.width = '100%';
          container.appendChild(input);
        }}>➕ Unteraufgabe</button>
        <br /><br />
        <button type="submit">✅ Aufgabe hinzufügen</button>
      </form>
      <hr style={{ margin: '2rem 0' }} />
      <h2>🗑️ Gelöschte Aufgaben</h2>
      {deletedItems.length === 0 ? <p>Keine Aufgaben gelöscht.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {deletedItems.map((item, i) => (
            <li key={i} style={{ background: '#ffecec', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

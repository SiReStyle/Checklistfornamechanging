import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const defaultChecklist = [
  { title: "Ausweis und Reisepass", description: "Neue Dokumente beim Bürgerbüro beantragen.", subtasks: ["Bürgerbüro-Termin buchen"] },
  { title: "Für deinen Hund Pepper", description: "Namensänderung bei Stadt, Tierarzt, Versicherung.", subtasks: ["Stadtverwaltung", "Tierarzt", "Versicherung"] },
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

  const [filter, setFilter] = useState("alle");

  const filteredItems = checklistItems.filter((item, index) => {
    const allChecked = checked[index]?.every(Boolean);
    if (filter === "erledigt") return allChecked;
    if (filter === "offen") return !allChecked;
    return true;
  });

  const handleExport = () => {
    const data = { checklistItems, checked };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "namenscheckliste.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    localStorage.setItem("custom_checklist", JSON.stringify(checklistItems));
  }, [checklistItems]);

  useEffect(() => {
    localStorage.setItem("checked_state", JSON.stringify(checked));
  }, [checked]);

  const addTask = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const subtasks = Array.from(e.target.querySelectorAll(".subtask-input")).map(i => i.value).filter(Boolean);
    const newItem = { title, description, subtasks };
    setChecklistItems([...checklistItems, newItem]);
    setChecked([...checked, subtasks.map(() => false)]);
    e.target.reset();
  };

  const addSubtaskField = () => {
    const container = document.getElementById('subtasks-container');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Weitere Unteraufgabe';
    input.className = 'subtask-input';
    container.appendChild(input);
  };

  return (
    <div>
      <h1>📜 Namensänderung Checkliste</h1>
      <div>
        <button onClick={() => setFilter("alle")}>📋 Alle</button>
        <button onClick={() => setFilter("offen")}>🖓 Offen</button>
        <button onClick={() => setFilter("erledigt")}>✅ Erledigt</button>
        <button onClick={handleExport}>⬇️ Exportieren</button>
      </div>
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <ul>
              {item.subtasks.map((sub, i) => (
                <li key={i}>
                  <input
                    type="checkbox"
                    checked={checked[index]?.[i] || false}
                    onChange={() => {
                      const newChecked = [...checked];
                      newChecked[index][i] = !newChecked[index][i];
                      setChecked(newChecked);
                      if (newChecked[index].every(Boolean)) confetti();
                    }}
                  />
                  {sub}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <hr />
      <h2>➕ Eigene Aufgabe hinzufügen</h2>
      <form onSubmit={addTask}>
        <input type="text" name="title" placeholder="Titel" required /><br />
        <textarea name="description" placeholder="Beschreibung" required></textarea><br />
        <div id="subtasks-container">
          <input type="text" className="subtask-input" placeholder="Unteraufgabe 1" />
        </div>
        <button type="button" onClick={addSubtaskField}>➕ Unteraufgabe</button><br />
        <button type="submit">✅ Aufgabe hinzufügen</button>
      </form>
    </div>
  );
}

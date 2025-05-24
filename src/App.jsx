import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    return saved ? JSON.parse(saved) : checklistItems.map(item => item.subtasks.map(() => false));
  });
  const [termine, setTermine] = useState(() => {
    const saved = localStorage.getItem("termine_state");
    return saved ? JSON.parse(saved) : {};
  });
  const [notizen, setNotizen] = useState(() => {
    const saved = localStorage.getItem("notizen_state");
    return saved ? JSON.parse(saved) : checklistItems.map(() => []);
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [filter, setFilter] = useState("alle");

  const filteredItems = checklistItems.filter((item, index) => {
    const isAllChecked = checked[index]?.every(Boolean);
    if (filter === "erledigt") return isAllChecked;
    if (filter === "offen") return !isAllChecked;
    return true;
  });

  const handleExport = () => {
    const data = {
      checklist: checklistItems,
      checked,
      termine,
      notizen
    };
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
  useEffect(() => {
    localStorage.setItem("termine_state", JSON.stringify(termine));
  }, [termine]);
  useEffect(() => {
    localStorage.setItem("notizen_state", JSON.stringify(notizen));
  }, [notizen]);
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newList = Array.from(checklistItems);
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);
    setChecklistItems(newList);
    setChecked(newList.map(item => item.subtasks.map(() => false)));
  };

  return (
    <div>
      <h1>📝 Namensänderung Checkliste</h1>
      <div>
        <button onClick={() => setFilter("alle")}>📋 Alle</button>
        <button onClick={() => setFilter("offen")}>🕓 Offen</button>
        <button onClick={() => setFilter("erledigt")}>✅ Erledigt</button>
        <button onClick={handleExport}>⬇️ Exportieren</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="checklist">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {filteredItems.map((item, realIndex) => { const index = checklistItems.indexOf(item); return (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {editIndex === index ? (
                        <div>
                          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                          <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                          <button onClick={() => {
                            const updatedItems = [...checklistItems];
                            updatedItems[index].title = editTitle;
                            updatedItems[index].description = editDesc;
                            setChecklistItems(updatedItems);
                            setEditIndex(null);
                          }}>💾 Speichern</button>
                          <button onClick={() => setEditIndex(null)}>✖️ Abbrechen</button>
                        </div>
                      ) : (
                        <>
                          <h2>{item.title}</h2>
                          <p>{item.description}</p>
                          <button onClick={() => {
                            setEditIndex(index);
                            setEditTitle(item.title);
                            setEditDesc(item.description);
                          }}>✏️ Bearbeiten</button>
                          <button onClick={() => {
                            const newItems = checklistItems.filter((_, i) => i !== index);
                            const newChecked = checked.filter((_, i) => i !== index);
                            const newNotizen = notizen.filter((_, i) => i !== index);
                            setChecklistItems(newItems);
                            setChecked(newChecked);
                            setNotizen(newNotizen);
                          }}>🗑️ Löschen</button>
                        </>
                      )}
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
                                if (newChecked[index].every(Boolean)) {
                                  confetti();
                                }
                              }}
                            /> {sub}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </Draggable>
              );})}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

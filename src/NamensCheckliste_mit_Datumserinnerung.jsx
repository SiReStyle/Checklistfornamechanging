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

// Der restliche Code wird gleich automatisch hinzugefügt oder per Hand ergänzt.


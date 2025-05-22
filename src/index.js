<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Silkes Namensänderung</title>
  </head>
  <body style="background: linear-gradient(to right, #ffecd2, #fcb69f); font-family: sans-serif;">
    <noscript>Bitte JavaScript aktivieren, um die Checkliste zu verwenden.</noscript>
    <div id="root"></div>
  </body>
</html>


// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import NamensCheckliste from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<NamensCheckliste />);

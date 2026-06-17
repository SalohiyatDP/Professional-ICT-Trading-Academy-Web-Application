import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { initDB } from "@/lib/db";
import "./index.css";

// Initialise IndexedDB before rendering so stores can hydrate from it.
initDB().catch((err) => {
  console.error("Failed to init IndexedDB", err);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

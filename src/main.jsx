import React from "react";
import ReactDOM from "react-dom/client";
// const queryClient = new QueryClient();
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./Router/Router";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

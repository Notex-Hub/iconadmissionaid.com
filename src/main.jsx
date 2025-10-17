import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./Router/Router";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "../redux/Store";
import { restoreSession } from "../redux/Features/Slice/RestoreSession";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

(async function init() {
  await restoreSession(store);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  );
})();

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ListPage from "./pages/list";

import IndexPage from "@/pages/index";
import HierarchyPage from "@/pages/hierarchy";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center" // You can customize the position
        autoClose={3000} // Time in ms before toast closes
        hideProgressBar={true}
        newestOnTop={false}
        // closeOnClick
        // rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="light" // 'light', 'dark', or 'colored'
      />
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<ListPage />} path="/list" />
        <Route element={<HierarchyPage />} path="/hierarchy" />
      </Routes>
    </>
  );
}

export default App;

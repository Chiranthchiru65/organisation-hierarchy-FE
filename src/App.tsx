import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DefaultLayout from "@/layouts/default";

import IndexPage from "@/pages/index";
import ListPage from "@/pages/list";
import HierarchyPage from "@/pages/hierarchy";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/hierarchy" element={<HierarchyPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";

import ListPage from "./pages/list";

import IndexPage from "@/pages/index";
import HierarchyPage from "@/pages/hierarchy";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ListPage />} path="/list" />
      <Route element={<HierarchyPage />} path="/hierarchy" />
    </Routes>
  );
}

export default App;

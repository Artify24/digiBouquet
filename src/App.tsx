/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import PreviewPage from "./pages/PreviewPage";
import SharePage from "./pages/SharePage";
import BouquetViewPage from "./pages/BouquetViewPage";
// Legacy route — kept for backward compat with old base64 share links
import ViewPage from "./pages/ViewPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/share" element={<SharePage />} />
        {/* New Supabase-backed public share route */}
        <Route path="/b/:slug" element={<BouquetViewPage />} />
        {/* Legacy base64 route */}
        <Route path="/view/:id" element={<ViewPage />} />
      </Routes>
    </Router>
  );
}

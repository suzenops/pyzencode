import { Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { Landing } from "./pages/Landing";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<Shell />} />
    </Routes>
  );
}

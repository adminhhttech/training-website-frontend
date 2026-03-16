import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ResumeBuilder from "./components/ResumeBuilder";
import { ResumeProvider } from "./contexts/ResumeContext";

export default function ResumeBuilderModule() {
  return (
    <ResumeProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route path="builder" element={<ResumeBuilder />} />
      </Routes>
    </ResumeProvider>
  );
}

import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { CVMatcher } from "./pages/CVMatcher";
import { JDAnalyzer } from "./pages/JDAnalyzer";
import { CoverLetter } from "./pages/CoverLetter";
import { InterviewPractice } from "./pages/InterviewPractice";
import { Tracker } from "./pages/Tracker";
import { About } from "./pages/About";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cv-matcher" element={<CVMatcher />} />
        <Route path="/jd-analyzer" element={<JDAnalyzer />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/interview-practice" element={<InterviewPractice />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;

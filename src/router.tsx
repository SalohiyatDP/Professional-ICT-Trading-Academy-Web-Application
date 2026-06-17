import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { ModulePage } from "@/pages/ModulePage";
import { LessonPage } from "@/pages/LessonPage";
import { QuizPage } from "@/pages/QuizPage";
import { ReplayPage } from "@/pages/ReplayPage";
import { ChartLabPage } from "@/pages/ChartLabPage";
import { RiskPage } from "@/pages/RiskPage";
import { ExamPage } from "@/pages/ExamPage";
import { TutorPage } from "@/pages/TutorPage";
import { CertificatesPage } from "@/pages/CertificatesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFound } from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "module/:moduleId", element: <ModulePage /> },
      { path: "module/:moduleId/lesson/:lessonId", element: <LessonPage /> },
      { path: "module/:moduleId/quiz", element: <QuizPage /> },
      { path: "replay", element: <ReplayPage /> },
      { path: "chart-lab", element: <ChartLabPage /> },
      { path: "risk", element: <RiskPage /> },
      { path: "exam", element: <ExamPage /> },
      { path: "tutor", element: <TutorPage /> },
      { path: "certificates", element: <CertificatesPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

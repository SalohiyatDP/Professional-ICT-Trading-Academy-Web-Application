import { useNavigate } from "react-router-dom";
import { finalExamWithCharts } from "@/data/finalExam";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { SectionTitle, Callout } from "@/components/ui";

export function ExamPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <SectionTitle
        title="🏆 Final Certification Exam"
        subtitle="Score 85%+ to qualify for the Professional ICT Trader certificate"
      />
      <Callout tone="info" title="How certification works">
        Your best exam score sets your certification level: 60% Beginner, 70% Intermediate, 80%
        Advanced, 85%+ Professional. Retake any time — your best result is kept.
      </Callout>
      <QuizEngine
        moduleId="final"
        questions={finalExamWithCharts}
        title="Final exam"
        onExit={() => navigate("/certificates")}
      />
    </div>
  );
}

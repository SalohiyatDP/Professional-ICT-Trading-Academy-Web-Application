import { useNavigate } from "react-router-dom";
import { finalExamWithCharts } from "@/data/finalExam";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { SectionTitle, Callout } from "@/components/ui";

export function ExamPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <SectionTitle
        title="🏆 Yakuniy Sertifikatsiya Imtihoni"
        subtitle="Professional ICT Treyder sertifikatiga ega bo'lish uchun 85%+ to'plang"
      />
      <Callout tone="info" title="Sertifikatsiya qanday ishlaydi">
        Eng yaxshi imtihon balingiz sertifikatsiya darajangizni belgilaydi: 60% Boshlang'ich, 70% O'rta, 80%
        Yuqori, 85%+ Professional. Istalgan vaqtda qayta topshiring — eng yaxshi natijangiz saqlanadi.
      </Callout>
      <QuizEngine
        moduleId="final"
        questions={finalExamWithCharts}
        title="Yakuniy imtihon"
        onExit={() => navigate("/certificates")}
      />
    </div>
  );
}

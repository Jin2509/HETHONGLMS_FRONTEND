import { Link, useParams } from "react-router";
import { ChevronLeft, Award, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

const result = {
  score: 8.5,
  totalQuestions: 30,
  correctAnswers: 27,
  percentile: 85,
  passed: true,
  sections: [
    { name: "HTML & CSS", score: 9.0, total: 10 },
    { name: "JavaScript", score: 8.5, total: 10 },
    { name: "React Fundamentals", score: 8.0, total: 10 },
  ],
  questions: [
    {
      id: 1,
      text: "What is the purpose of React hooks?",
      yourAnswer: "To add state to functional components",
      correctAnswer: "To add state to functional components",
      isCorrect: true,
      explanation: "React hooks allow you to use state and other React features in functional components.",
    },
    {
      id: 2,
      text: "Which of the following are valid CSS selectors?",
      yourAnswer: ".class-name, #id-name, element-name",
      correctAnswer: ".class-name, #id-name, element-name",
      isCorrect: true,
      explanation: "@attribute is not a valid CSS selector syntax.",
    },
  ],
};

export function ExamResult() {
  const { id } = useParams();

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/exams" className="text-sm text-primary hover:underline">
          ← Quay lại danh sách bài kiểm tra
        </Link>
      </div>

      {/* Score Card */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-slate-200"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-success"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(result.score / 10) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-success">{result.score}</div>
                <div className="text-sm text-muted-foreground">/ 10</div>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
              {result.passed ? "Chúc mừng! Bạn đã đạt" : "Chưa đạt"}
            </h1>
            <p className="text-muted-foreground mb-4">
              Midterm Exam - Web Development
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-xs text-muted-foreground">Câu đúng</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {result.percentile}%
                </div>
                <div className="text-xs text-muted-foreground">Percentile</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg col-span-2 md:col-span-1">
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-warning" />
                  <span className="text-sm font-medium">Top 15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Điểm theo chủ đề
        </h2>
        <div className="space-y-4">
          {result.sections.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{section.name}</span>
                <span className="text-sm text-muted-foreground">
                  {section.score}/{section.total}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(section.score / section.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Xem lại câu hỏi</h2>
        <div className="space-y-6">
          {result.questions.map((question, idx) => (
            <div
              key={question.id}
              className={`p-4 rounded-lg border-2 ${
                question.isCorrect
                  ? "border-success/20 bg-success/5"
                  : "border-destructive/20 bg-destructive/5"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {question.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="font-medium mb-2">
                    Câu {idx + 1}: {question.text}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Câu trả lời của bạn: </span>
                      <span
                        className={
                          question.isCorrect
                            ? "text-success font-medium"
                            : "text-destructive font-medium"
                        }
                      >
                        {question.yourAnswer}
                      </span>
                    </div>
                    {!question.isCorrect && (
                      <div>
                        <span className="text-muted-foreground">Đáp án đúng: </span>
                        <span className="text-success font-medium">
                          {question.correctAnswer}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-muted-foreground italic">
                        {question.explanation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

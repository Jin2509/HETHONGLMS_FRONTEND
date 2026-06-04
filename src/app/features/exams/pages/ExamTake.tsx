import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Flag, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "What is the purpose of React hooks?",
    type: "single",
    options: [
      "To add state to functional components",
      "To style components",
      "To fetch data from APIs",
      "To create class components",
    ],
  },
  {
    id: 2,
    text: "Which of the following are valid CSS selectors? (Select all that apply)",
    type: "multiple",
    options: [".class-name", "#id-name", "element-name", "@attribute"],
  },
  {
    id: 3,
    text: "What does the 'virtual DOM' refer to in React?",
    type: "single",
    options: [
      "A copy of the real DOM kept in memory",
      "A CSS framework",
      "A testing library",
      "A state management tool",
    ],
  },
];

export function ExamTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const toggleFlag = (questionId: number) => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlagged(newFlagged);
  };

  const handleSubmit = () => {
    if (confirm("Bạn có chắc chắn muốn nộp bài?")) {
      navigate(`/exams/${id}/result`);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 5 * 60;

  const question = questions[currentQuestion];
  const isAnswered = answers[question.id] !== undefined;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Topbar */}
      <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Midterm Exam - Web Development</h1>
        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-2 font-mono text-lg font-medium ${
              isLowTime ? "text-destructive" : "text-foreground"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {Object.keys(answers).length}/{questions.length}
          </div>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium"
          >
            Nộp bài
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Question Navigation */}
        <div className="w-64 bg-card border-r border-border p-4 overflow-y-auto">
          <h3 className="font-medium mb-4">Câu hỏi</h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined;
              const isFlagged = flagged.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`aspect-square rounded-lg font-medium text-sm transition-colors ${
                    currentQuestion === idx
                      ? "bg-primary text-white"
                      : answered
                      ? "bg-primary/20 text-primary"
                      : isFlagged
                      ? "bg-warning/20 text-warning"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Câu {currentQuestion + 1} / {questions.length}
                  </div>
                  <h2 className="text-xl font-semibold">{question.text}</h2>
                </div>
                <button
                  onClick={() => toggleFlag(question.id)}
                  className={`p-2 rounded-lg ${
                    flagged.has(question.id)
                      ? "bg-warning/20 text-warning"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {question.type === "single"
                  ? question.options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          answers[question.id] === idx
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === idx}
                          onChange={() => handleAnswer(question.id, idx)}
                          className="mt-1 w-4 h-4 text-primary"
                        />
                        <span className="flex-1">{option}</span>
                      </label>
                    ))
                  : question.options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          answers[question.id]?.includes(idx)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={answers[question.id]?.includes(idx) || false}
                          onChange={(e) => {
                            const current = answers[question.id] || [];
                            const updated = e.target.checked
                              ? [...current, idx]
                              : current.filter((i: number) => i !== idx);
                            handleAnswer(question.id, updated);
                          }}
                          className="mt-1 w-4 h-4 text-primary"
                        />
                        <span className="flex-1">{option}</span>
                      </label>
                    ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="border-t border-border p-6">
            <div className="max-w-3xl mx-auto flex gap-4">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Câu trước</span>
              </button>
              <button
                onClick={() =>
                  setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))
                }
                disabled={currentQuestion === questions.length - 1}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium">Câu tiếp</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

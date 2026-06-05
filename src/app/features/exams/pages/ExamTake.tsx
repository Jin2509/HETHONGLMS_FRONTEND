import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Flag, ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { useExam } from "../hooks/useExam";
import { toast } from "sonner";

export function ExamTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    examDetail, 
    loading, 
    fetchExamDetail, 
    submitExamAnswers 
  } = useExam();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (id) {
      fetchExamDetail(parseInt(id));
    }
  }, [id, fetchExamDetail]);

  useEffect(() => {
    if (examDetail) {
      setTimeLeft(examDetail.duration * 60);
    }
  }, [examDetail]);

  useEffect(() => {
    if (timeLeft <= 0 && examDetail) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examDetail]);

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

  const handleAutoSubmit = async () => {
    if (!id || !examDetail) return;
    try {
      await submitExamAnswers(parseInt(id), answers);
      toast.info("Hết giờ! Bài làm đã được tự động nộp.");
      navigate(`/exams/${id}/result`);
    } catch (error) {
      toast.error("Không thể tự động nộp bài. Vui lòng liên hệ giáo viên.");
    }
  };

  const handleSubmit = async () => {
    if (!id || !examDetail) return;
    if (confirm("Bạn có chắc chắn muốn nộp bài?")) {
      try {
        await submitExamAnswers(parseInt(id), answers);
        toast.success("Nộp bài thành công!");
        navigate(`/exams/${id}/result`);
      } catch (error) {
        toast.error("Không thể nộp bài. Vui lòng thử lại.");
      }
    }
  };

  if (loading && !examDetail) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (!examDetail) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy thông tin đề thi.</p>
          <button onClick={() => navigate("/exams")} className="text-primary hover:underline">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const questions = examDetail.questions || [];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 5 * 60;

  const question = questions[currentQuestionIdx];
  if (!question) return null;

  const isAnswered = answers[question.id] !== undefined;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Topbar */}
      <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{examDetail.name}</h1>
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
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`aspect-square rounded-lg font-medium text-sm transition-colors ${
                    currentQuestionIdx === idx
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
                    Câu {currentQuestionIdx + 1} / {questions.length}
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
                  ? question.options.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          answers[question.id] === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === option.id}
                          onChange={() => handleAnswer(question.id, option.id)}
                          className="mt-1 w-4 h-4 text-primary"
                        />
                        <span className="flex-1">{option.text}</span>
                      </label>
                    ))
                  : question.options.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          answers[question.id]?.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={answers[question.id]?.includes(option.id) || false}
                          onChange={(e) => {
                            const current = answers[question.id] || [];
                            const updated = e.target.checked
                              ? [...current, option.id]
                              : current.filter((i: number) => i !== option.id);
                            handleAnswer(question.id, updated);
                          }}
                          className="mt-1 w-4 h-4 text-primary"
                        />
                        <span className="flex-1">{option.text}</span>
                      </label>
                    ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="border-t border-border p-6">
            <div className="max-w-3xl mx-auto flex gap-4">
              <button
                onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                disabled={currentQuestionIdx === 0}
                className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Câu trước</span>
              </button>
              <button
                onClick={() =>
                  setCurrentQuestionIdx(Math.min(questions.length - 1, currentQuestionIdx + 1))
                }
                disabled={currentQuestionIdx === questions.length - 1}
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

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface StudentSubmissionPanelProps {
  assignmentId: string | undefined;
}

export function StudentSubmissionPanel({ assignmentId }: StudentSubmissionPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textSubmission, setTextSubmission] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // TODO: Gọi API nộp bài
    console.log("Submitting assignment:", assignmentId, { file: selectedFile, note: textSubmission });
    toast.success("Nộp bài thành công", {
      description: "Bài tập của bạn đã được ghi nhận",
    });
    setSelectedFile(null);
    setTextSubmission("");
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Nộp bài</h2>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload file</label>
          <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Kéo thả file hoặc click để chọn
              </p>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ: .zip, .pdf, .doc (Max 10MB)
              </p>
            </label>
          </div>
          {selectedFile && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium">{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="ml-auto text-destructive hover:underline"
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        {/* Text Submission */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={textSubmission}
            onChange={(e) => setTextSubmission(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={4}
            placeholder="Thêm ghi chú cho bài nộp..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Nộp bài tập
        </button>
      </div>

      {/* Submission History */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Lịch sử nộp bài</h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium">Lần 1</span>
              <span className="text-xs text-muted-foreground">
                01/06/2026 14:30
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                submission-v1.zip
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

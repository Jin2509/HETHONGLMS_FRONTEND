import { Calendar, Clock, FileText, Download } from "lucide-react";
import type { AssignmentDetail } from "../types/assignment.types";
import { downloadAssignmentAttachment } from "../../../../service/assignment.service";
import { toast } from "sonner";

interface AssignmentInfoProps {
  assignment: AssignmentDetail;
}

export function AssignmentInfo({ assignment }: AssignmentInfoProps) {
  const handleDownload = async (attachment: AssignmentDetail["attachments"][number]) => {
    try {
      await downloadAssignmentAttachment(assignment.id, attachment);
    } catch {
      toast.error("Không thể tải tài liệu đính kèm");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">{assignment.name}</h1>

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Hạn nộp: {assignment.dueDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-warning" />
          <span className="text-warning font-medium">{assignment.hoursLeft} giờ nữa</span>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          {assignment.course}
        </span>
      </div>

      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-semibold mb-3">Mô tả bài tập</h3>
        <p className="text-muted-foreground mb-4">{assignment.description}</p>
        
        {assignment.requirements.length > 0 && (
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            {assignment.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        )}

        {assignment.attachments.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-3">Tài liệu đính kèm</h3>
            {assignment.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg w-fit mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">{attachment.size}</p>
                </div>
                <button
                  onClick={() => handleDownload(attachment)}
                  className="ml-4 p-2 hover:bg-white rounded transition-colors"
                  title="Tải tài liệu"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

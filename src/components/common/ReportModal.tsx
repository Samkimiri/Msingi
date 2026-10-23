import React, { useState } from 'react';
import { AlertCircle, X, Check } from 'lucide-react';
import { StorageService } from '../../lib/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'question' | 'flashcard' | 'rafiki_message';
  contentId: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  contentType,
  contentId,
}) => {
  const [issueText, setIssueText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;

    StorageService.saveContentReport({
      content_type: contentType,
      content_id: contentId,
      issue_text: issueText.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIssueText('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-surface-border w-full max-w-sm rounded-2xl p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 bg-savannah-500/20 text-savannah-400 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Asante! Report Received</h4>
            <p className="text-xs text-slate-400">Our content auditor will inspect this against Microsoft Learn.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 text-sunset-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Report Content Issue</h3>
            </div>

            <p className="text-xs text-slate-400">
              Found a typo, outdated terminology, or ambiguous explanation in this {contentType}? Help us keep Msingi 100% accurate.
            </p>

            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="Describe the discrepancy or what to verify on Microsoft Learn..."
              rows={3}
              className="w-full bg-surface-light border border-surface-border rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sunset-500"
              required
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-surface-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sunset-500 hover:bg-sunset-600 text-white shadow-glow-orange transition-all"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


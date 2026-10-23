import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Check } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { modalBackdropVariants, modalContentVariants } from '../../lib/motion';

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        >
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-strong border border-slate-200/90 w-full max-w-sm rounded-2xl p-5 shadow-2xl relative max-h-[92dvh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-transform active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Asante! Report Received</h4>
                <p className="text-xs text-slate-600">Our content auditor will inspect this against Microsoft Learn.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">Report Content Issue</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Found a typo, outdated terminology, or ambiguous explanation in this {contentType}? Help us keep Msingi 100% accurate.
                </p>

                <textarea
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="Describe the discrepancy or what to verify on Microsoft Learn..."
                  rows={3}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  required
                />

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all active:scale-[0.97]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-[0.97] hover:-translate-y-px"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

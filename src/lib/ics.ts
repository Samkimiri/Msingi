import { PlanTask } from '../types';

export function exportTasksToIcs(tasks: PlanTask[], examDateStr: string): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Msingi//AZ-900 Study Plan//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  tasks.forEach((task, idx) => {
    const dateFormatted = task.date.replace(/-/g, '');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:msingi-task-${task.id}-${idx}@msingi.africa`);
    lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
    lines.push(`DTSTART;VALUE=DATE:${dateFormatted}`);
    lines.push(`DTEND;VALUE=DATE:${dateFormatted}`);
    lines.push(`SUMMARY:Msingi: ${task.title}`);
    lines.push(
      `DESCRIPTION:Study task for AZ-900. Estimated time: ${task.estimated_minutes} mins.\\nStatus: ${
        task.is_completed ? 'Completed' : 'Pending'
      }\\n\\nMsingi is an unofficial study tool.`
    );
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  // Exam Day Event
  const examFormatted = examDateStr.replace(/-/g, '');
  lines.push('BEGIN:VEVENT');
  lines.push(`UID:msingi-exam-${examFormatted}@msingi.africa`);
  lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
  lines.push(`DTSTART;VALUE=DATE:${examFormatted}`);
  lines.push(`DTEND;VALUE=DATE:${examFormatted}`);
  lines.push('SUMMARY:🎯 AZ-900 Microsoft Azure Fundamentals Exam Day');
  lines.push('DESCRIPTION:You are ready! Good luck on your AZ-900 exam.');
  lines.push('STATUS:CONFIRMED');
  lines.push('END:VEVENT');

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcsFile(content: string, filename = 'msingi-az900-plan.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


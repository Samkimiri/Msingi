import { TOPICS, DOMAINS } from '../data/az900-syllabus';
import { PlanTask, StudyPlan, TaskType, WeekdayHours } from '../types';

export function generateStudyPlan(
  examDateStr: string,
  hoursPerDay: WeekdayHours,
  weakTopicIds: string[],
  startDate: Date = new Date()
): { plan: StudyPlan; tasks: PlanTask[] } {
  const planId = 'plan-' + Date.now();
  const examDate = new Date(examDateStr);
  examDate.setHours(0, 0, 0, 0);

  const cur = new Date(startDate);
  cur.setHours(0, 0, 0, 0);

  // Total days until exam
  const dayDifference = Math.max(
    1,
    Math.round((examDate.getTime() - cur.getTime()) / (1000 * 60 * 60 * 24))
  );

  const plan: StudyPlan = {
    id: planId,
    exam_date: examDateStr,
    hours_per_day: hoursPerDay,
    weak_topics: weakTopicIds,
    created_at: new Date().toISOString(),
  };

  const tasks: PlanTask[] = [];

  // Calculate topic weights: (domain_weight * weakness_multiplier)
  const topicWeights = TOPICS.map(topic => {
    const domain = DOMAINS.find(d => d.id === topic.domain_id);
    const domainWeight = domain ? (domain.weight_min_pct + domain.weight_max_pct) / 2 : 30;
    const isWeak = weakTopicIds.includes(topic.id);
    const weight = isWeak ? domainWeight * 2.2 : domainWeight;
    return { topic, weight };
  });

  // Sort topics by priority
  topicWeights.sort((a, b) => b.weight - a.weight);

  const dayNames: (keyof WeekdayHours)[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  let topicIndex = 0;

  for (let dayOffset = 0; dayOffset < dayDifference; dayOffset++) {
    const targetDate = new Date(cur.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dayOfWeek = targetDate.getDay();
    const dayKey = dayNames[dayOfWeek];
    const availableHours = hoursPerDay[dayKey] ?? 1.5;
    const dateStr = targetDate.toISOString().split('T')[0];

    const daysUntilExam = dayDifference - dayOffset;

    if (daysUntilExam === 1) {
      // Day before exam: Light review & calm preparation
      tasks.push({
        id: `task-${dayOffset}-1`,
        plan_id: planId,
        date: dateStr,
        task_type: 'review',
        title: 'Light Summary Review: Core Definitions & Exam Tips',
        estimated_minutes: Math.min(60, Math.round(availableHours * 60)),
        is_completed: false,
      });
      tasks.push({
        id: `task-${dayOffset}-2`,
        plan_id: planId,
        date: dateStr,
        task_type: 'flashcards',
        title: 'Quick Flashcard Refresh (High-Yield Cloud Concepts)',
        estimated_minutes: 20,
        is_completed: false,
      });
      continue;
    }

    if (daysUntilExam === 3) {
      // 3 days before exam: Full Timed Mock Exam
      tasks.push({
        id: `task-${dayOffset}-mock`,
        plan_id: planId,
        date: dateStr,
        task_type: 'mock',
        title: 'Full 40-Question Timed Mock Exam Simulation',
        estimated_minutes: 45,
        is_completed: false,
      });
      tasks.push({
        id: `task-${dayOffset}-review`,
        plan_id: planId,
        date: dateStr,
        task_type: 'study',
        title: 'Review Mock Exam Answers & Wrong Explanations',
        estimated_minutes: 30,
        is_completed: false,
      });
      continue;
    }

    // Normal study days
    if (availableHours <= 0.25) {
      // Minimal day
      tasks.push({
        id: `task-${dayOffset}-micro`,
        plan_id: planId,
        date: dateStr,
        task_type: 'flashcards',
        title: 'Quick 10-Minute Daily Spaced Repetition Flashcards',
        estimated_minutes: 15,
        is_completed: false,
      });
      continue;
    }

    // Allocate study topic and quiz/flashcards
    const currentItem = topicWeights[topicIndex % topicWeights.length];
    topicIndex++;

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const taskType: TaskType = isWeekend ? 'quiz' : 'study';

    tasks.push({
      id: `task-${dayOffset}-core`,
      plan_id: planId,
      date: dateStr,
      topic_id: currentItem.topic.id,
      task_type: taskType,
      title: `${taskType === 'study' ? 'Deep Dive' : 'Practice Quiz'}: ${currentItem.topic.title}`,
      estimated_minutes: Math.round(Math.min(availableHours * 40, 60)),
      is_completed: false,
    });

    tasks.push({
      id: `task-${dayOffset}-fc`,
      plan_id: planId,
      date: dateStr,
      topic_id: currentItem.topic.id,
      task_type: 'flashcards',
      title: `Spaced Repetition Flashcards: ${currentItem.topic.title}`,
      estimated_minutes: 15,
      is_completed: false,
    });
  }

  return { plan, tasks };
}


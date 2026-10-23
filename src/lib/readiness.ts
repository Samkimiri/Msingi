import { DOMAINS, TOPICS } from '../data/az900-syllabus';
import {
  Attempt,
  DomainReadiness,
  MockExam,
  ReadinessScoreResult,
  TopicReadiness,
} from '../types';

export function calculateReadiness(
  attempts: Attempt[],
  mockExams: MockExam[],
  allQuestionsMap: Record<string, { topic_id: string }>
): ReadinessScoreResult {
  // 1. Group attempts by domain and by topic
  const domainAttempts: Record<string, Attempt[]> = {
    'dom-1': [],
    'dom-2': [],
    'dom-3': [],
  };

  const topicAttempts: Record<string, Attempt[]> = {};
  TOPICS.forEach(t => {
    topicAttempts[t.id] = [];
  });

  // Sort attempts chronological (oldest to newest)
  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  sortedAttempts.forEach(att => {
    const qInfo = allQuestionsMap[att.question_id];
    if (!qInfo) return;

    if (topicAttempts[qInfo.topic_id]) {
      topicAttempts[qInfo.topic_id].push(att);
    }

    const topic = TOPICS.find(t => t.id === qInfo.topic_id);
    if (topic && domainAttempts[topic.domain_id]) {
      domainAttempts[topic.domain_id].push(att);
    }
  });

  // 2. Midpoints of domain weights normalised to 100%
  // Dom 1: 27.5, Dom 2: 37.5, Dom 3: 32.5 => sum = 97.5
  const midpoints: Record<string, number> = {
    'dom-1': 27.5,
    'dom-2': 37.5,
    'dom-3': 32.5,
  };
  const sumMidpoints = 27.5 + 37.5 + 32.5;

  let totalWeightedScore = 0;
  let allDomainsHaveEnoughData = true;

  const domainBreakdowns: DomainReadiness[] = DOMAINS.map(domain => {
    const rawAttempts = domainAttempts[domain.id] || [];
    // Take up to the 50 most recent attempts
    const recent = rawAttempts.slice(-50);
    const count = recent.length;
    const hasEnoughData = count >= 15;

    if (!hasEnoughData) {
      allDomainsHaveEnoughData = false;
    }

    let accuracyPct = 0;
    if (count > 0) {
      // Linear recency weighting: weight = index + 1 (oldest = 1, newest = count)
      let weightedSuccessSum = 0;
      let totalWeight = 0;

      recent.forEach((att, idx) => {
        const weight = idx + 1;
        totalWeight += weight;
        if (att.is_correct) {
          weightedSuccessSum += weight;
        }
      });

      accuracyPct = (weightedSuccessSum / totalWeight) * 100;
    }

    const normWeight = (midpoints[domain.id] / sumMidpoints) * 100;
    totalWeightedScore += (normWeight / 100) * accuracyPct;

    return {
      domain_id: domain.id,
      domain_name: domain.name,
      exam_weight_pct: Number(normWeight.toFixed(1)),
      recent_accuracy_pct: Math.round(accuracyPct),
      attempts_count: count,
      has_enough_data: hasEnoughData,
    };
  });

  const overallScore = Math.min(100, Math.round(totalWeightedScore));

  // Check mock exams qualification (at least 2 mocks scoring 80+)
  const qualifyingMocks = mockExams.filter(m => m.score_pct >= 80).length;
  const mockExamQualifies = qualifyingMocks >= 2;

  // Determine readiness band
  let band: ReadinessScoreResult['band'] = 'Not ready';
  let bandDescription = 'Keep building your foundation. Focus on learning core cloud principles and completing practice quizzes.';

  if (!allDomainsHaveEnoughData && overallScore >= 60) {
    band = 'Not ready';
    bandDescription = 'Keep practising: answer at least 15 questions per domain to establish an accurate readiness score.';
  } else if (overallScore >= 85 && mockExamQualifies) {
    band = 'Exam ready';
    bandDescription = 'Excellent! You have demonstrated high mastery across all domains and passed 2+ full mock exams with 80%+.';
  } else if (overallScore >= 85 && !mockExamQualifies) {
    band = 'Almost ready';
    bandDescription = 'High domain mastery! Pass at least 2 full timed mock exams with 80%+ to unlock "Exam ready" status.';
  } else if (overallScore >= 75) {
    band = 'Almost ready';
    bandDescription = 'Strong grasp of Azure concepts. Strengthen your weaker topics and start timed mock exams.';
  } else if (overallScore >= 60) {
    band = 'Getting there';
    bandDescription = 'Solid foundation underway. Review the explanations for wrong answers to push into the target zone.';
  }

  // 3. Topic Heatmap Breakdown
  const topicReadiness: TopicReadiness[] = TOPICS.map(topic => {
    const list = topicAttempts[topic.id] || [];
    const correctCount = list.filter(a => a.is_correct).length;
    const accuracy = list.length > 0 ? Math.round((correctCount / list.length) * 100) : 0;
    // Mark weak if answered at least once and accuracy < 60%
    const isWeak = list.length > 0 && accuracy < 60;

    return {
      topic_id: topic.id,
      topic_title: topic.title,
      domain_id: topic.domain_id,
      slug: topic.slug,
      total_attempts: list.length,
      correct_attempts: correctCount,
      accuracy_pct: accuracy,
      is_weak: isWeak,
    };
  });

  // 4. Streak calculation
  let streakDays = 0;
  if (attempts.length > 0) {
    const dates = new Set(
      attempts.map(a => new Date(a.created_at).toISOString().split('T')[0])
    );
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      if (dates.has(d)) {
        streakDays += 1;
      } else if (i === 0) {
        // user may not have answered today yet
        continue;
      } else {
        break;
      }
    }
  }

  // 5. Next Best Action Card
  let nextBestAction: ReadinessScoreResult['next_best_action'] = {
    title: 'Start Diagnostic Quiz',
    description: 'Seed your baseline readiness score with a fast 10-question diagnostic across all 3 domains.',
    action_url: '/quiz?mode=diagnostic',
    action_label: 'Start Diagnostic',
    type: 'diagnostic',
  };

  const weakTopics = topicReadiness.filter(t => t.is_weak);
  const totalAnswered = attempts.length;

  if (totalAnswered === 0) {
    nextBestAction = {
      title: 'Take the 10-Question Diagnostic',
      description: 'Find your baseline strengths and immediately uncover which Azure domains need focus.',
      action_url: '/quiz?mode=diagnostic',
      action_label: 'Start Diagnostic',
      type: 'diagnostic',
    };
  } else if (!allDomainsHaveEnoughData) {
    const underDomain = domainBreakdowns.find(d => !d.has_enough_data);
    nextBestAction = {
      title: `Build Data: ${underDomain?.domain_name ?? 'Azure'}`,
      description: `Complete more questions in "${underDomain?.domain_name}" to unlock your reliable readiness baseline.`,
      action_url: `/quiz?domain=${underDomain?.domain_id}`,
      action_label: 'Practice Domain',
      type: 'quiz',
    };
  } else if (weakTopics.length > 0) {
    nextBestAction = {
      title: `Revise Weak Areas (${weakTopics.length} topics)`,
      description: `Focus practice on topics where your recent accuracy is under 60%: ${weakTopics[0].topic_title}.`,
      action_url: '/quiz?mode=weak',
      action_label: 'Train Weak Areas',
      type: 'quiz',
    };
  } else if (overallScore >= 75 && qualifyingMocks < 2) {
    nextBestAction = {
      title: 'Take a Full Mock Exam',
      description: 'Simulate the real exam: 40 questions, 45-minute timer, full domain weighting.',
      action_url: '/quiz?mode=mock',
      action_label: 'Start Mock Exam',
      type: 'mock',
    };
  } else {
    nextBestAction = {
      title: 'Daily Spaced Repetition',
      description: 'Review your flashcard deck to cement long-term retention before exam day.',
      action_url: '/flashcards',
      action_label: 'Open Flashcards',
      type: 'flashcard',
    };
  }

  return {
    overall_score: overallScore,
    band,
    band_description: bandDescription,
    domain_breakdowns: domainBreakdowns,
    topic_readiness: topicReadiness,
    mock_exam_qualifies: mockExamQualifies,
    streak_days: streakDays,
    total_questions_answered: attempts.length,
    next_best_action: nextBestAction,
  };
}


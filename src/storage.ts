import type { ProgressState, TopicId } from './types'

const STORAGE_KEY = 'chemistry-study-progress-v1'
const today = new Date().toISOString().slice(0, 10)
export const defaultProgress: ProgressState = { xp: 240, streak: 3, lastStudyDate: today, masteredTopics: ['bohr', 'quantum'], topicCorrect: { bohr: 3, quantum: 3 }, completedQuestions: 12, theme: 'light' }

export function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultProgress, ...JSON.parse(stored) as Partial<ProgressState> } : defaultProgress
  } catch { return defaultProgress }
}

export function saveProgress(progress: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function awardStudy(progress: ProgressState, xp: number, topic?: TopicId): ProgressState {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const topicCorrect = { ...progress.topicCorrect }
  if (topic) topicCorrect[topic] = (topicCorrect[topic] ?? 0) + 1
  return {
    ...progress, xp: progress.xp + xp,
    streak: progress.lastStudyDate === today ? progress.streak : progress.lastStudyDate === yesterday ? progress.streak + 1 : 1,
    lastStudyDate: today,
    topicCorrect,
    completedQuestions: progress.completedQuestions + 1,
    masteredTopics: topic && topicCorrect[topic]! >= 3 && !progress.masteredTopics.includes(topic) ? [...progress.masteredTopics, topic] : progress.masteredTopics,
  }
}
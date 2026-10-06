export type TopicId = 'bohr' | 'light' | 'quantum' | 'orbitals' | 'filling' | 'configuration' | 'pes' | 'vsepr' | 'trends'
export type Question = { id: string; topic: TopicId; prompt: string; options: string[]; answer: number; explanation: string }
export type Flashcard = { id: string; topic: TopicId; front: string; back: string }
export type ProgressState = {
  xp: number
  streak: number
  lastStudyDate: string
  masteredTopics: TopicId[]
  topicCorrect: Partial<Record<TopicId, number>>
  completedQuestions: number
  theme: 'light' | 'dark'
}
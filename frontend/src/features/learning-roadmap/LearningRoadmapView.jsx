import { BookOpen } from 'lucide-react'
import ComingSoonView from '../../components/ComingSoonView'

export default function LearningRoadmapView({ onNavigateToActive }) {
  return (
    <ComingSoonView
      title="AI Learning Hub & Dynamic Roadmap"
      category="MODULE 2: ADAPTIVE CURRICULUM"
      icon={BookOpen}
      description="An intelligent multi-stage video and hands-on learning roadmap generated dynamically based on the exact weaknesses detected in your Skill Gap report."
      features={[
        'Dynamic roadmap sequencing from Phase 1 Skill Gap results',
        'Embedded video lecture checkpoints with real playback tracking',
        'Spaced Repetition retention engine with daily review flashcards',
        'Gamified XP rewards, streaks, and milestone mastery badges',
      ]}
      onNavigateToActive={onNavigateToActive}
    />
  )
}

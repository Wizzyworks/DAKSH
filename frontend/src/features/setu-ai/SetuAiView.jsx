import { Bot } from 'lucide-react'
import ComingSoonView from '../../components/ComingSoonView'

export default function SetuAiView({ onNavigateToActive }) {
  return (
    <ComingSoonView
      title="SETU AI — Neural Placement Mentor & Chatbot"
      category="MODULE 2.5: 24/7 AI COACH"
      icon={Bot}
      description="A 24/7 Socratic mentor chatbot that contextually assists you as you learn, explains complex data structures, and guides you through interview doubts."
      features={[
        'Socratic guidance (explains why an answer is wrong without spoon-feeding)',
        'Context-aware memory tied to your active learning stage and skill gaps',
        'Real-time streaming responses with syntax-highlighted code snippets',
        'Career pathway & campus placement strategy counseling',
      ]}
      onNavigateToActive={onNavigateToActive}
    />
  )
}

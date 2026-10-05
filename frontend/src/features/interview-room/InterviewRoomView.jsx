import { Mic } from 'lucide-react'
import ComingSoonView from '../../components/ComingSoonView'

export default function InterviewRoomView({ onNavigateToActive }) {
  return (
    <ComingSoonView
      title="AI Interview Room & Assessment Arena"
      category="MODULE 3: MULTI-ROUND SIMULATOR"
      icon={Mic}
      description="Full-length multi-round technical and HR mock interviews powered by in-browser Python sandbox execution and voice speech analysis."
      features={[
        'Round 1: Adaptive MCQ Breadth Screening',
        'Round 2: Descriptive & System Design Deep-Dive',
        'Round 3: In-Browser Python Coding Sandbox (Pyodide WASM)',
        'Round 4: Voice-to-Voice Behavioral Round (STAR method grading)',
        'LLM-as-a-Judge real-time rubric scorecard with Radar Chart breakdown',
      ]}
      onNavigateToActive={onNavigateToActive}
    />
  )
}

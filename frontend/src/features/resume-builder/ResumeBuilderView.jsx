import { FileText } from 'lucide-react'
import ComingSoonView from '../../components/ComingSoonView'

export default function ResumeBuilderView({ onNavigateToActive }) {
  return (
    <ComingSoonView
      title="AI Resume Builder & LaTeX Optimizer"
      category="MODULE 4: ATS OPTIMIZATION"
      icon={FileText}
      description="Professional LaTeX resume generator that automatically injects missing JD keywords and rewrites bullet points into high-impact STAR achievement metrics."
      features={[
        'Mode A: Reformat existing CV into clean, modern LaTeX PDF',
        'Mode B: Target JD Reference Template generator',
        'Mode C: CV + JD Optimization Engine with ATS compliance score audit',
        'Direct Jinja2 LaTeX source (.tex) and compiled PDF downloads',
      ]}
      onNavigateToActive={onNavigateToActive}
    />
  )
}

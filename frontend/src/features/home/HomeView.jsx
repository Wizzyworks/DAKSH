import { Home } from 'lucide-react'
import ComingSoonView from '../../components/ComingSoonView'

export default function HomeView({ onNavigateToActive }) {
  return (
    <ComingSoonView
      title="Daksh Unified Placement Dashboard"
      category="COMMAND CENTER"
      icon={Home}
      description="Your central telemetry hub aggregating streak metrics, upcoming campus drive deadlines, daily coding challenges, and cross-module progress."
      features={[
        'Unified readiness telemetry & daily placement streak tracking',
        'Live company placement drive notifications & deadline calendar',
        'Weekly mock interview schedule & live peer ranking leaderboard',
        'Quick action widgets connecting to active Skill Gap and Learning stages',
      ]}
      onNavigateToActive={onNavigateToActive}
    />
  )
}

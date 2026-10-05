import { Settings } from 'lucide-react'
import ComingSoonView from '../../components/ComingSoonView'

export default function SettingsView({ onNavigateToActive }) {
  return (
    <ComingSoonView
      title="Candidate Profile & Account Settings"
      category="USER PREFERENCES"
      icon={Settings}
      description="Manage your target role preferences, sync GitHub repositories, update college graduation details, and customize notification channels."
      features={[
        'Update Target Job Taxonomy & Tier Preferences',
        'GitHub Token sync for automatic repository code auditing',
        'Academic credentials and transcript verification',
        'Dark / Light theme and communication alerts customization',
      ]}
      onNavigateToActive={onNavigateToActive}
    />
  )
}

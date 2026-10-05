import { Briefcase } from 'lucide-react'
import ComingSoonView from '../../components/ComingSoonView'

export default function JobSearchView({ onNavigateToActive }) {
  return (
    <ComingSoonView
      title="AI Job Search & Opportunity Hub"
      category="MODULE 5: OPPORTUNITY AGGREGATOR"
      icon={Briefcase}
      description="Unified career aggregation monitoring Google Jobs, national government portals, Devpost hackathons, and GitHub open-source repositories."
      features={[
        'Google Jobs & Government portal (MoSPI, SSC, UPSC) live feeds',
        'Profile-aware match score calculation per job vacancy',
        'Hackathon, coding challenge, and open-source sprint calendar',
        '1-Click direct apply links & personalized alert notifications',
      ]}
      onNavigateToActive={onNavigateToActive}
    />
  )
}

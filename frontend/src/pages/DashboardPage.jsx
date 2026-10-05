import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'

// Modular Feature Views
import SkillGapWorkspace from '../features/skill-gap/SkillGapWorkspace'
import HomeView from '../features/home/HomeView'
import LearningRoadmapView from '../features/learning-roadmap/LearningRoadmapView'
import SetuAiView from '../features/setu-ai/SetuAiView'
import InterviewRoomView from '../features/interview-room/InterviewRoomView'
import ResumeBuilderView from '../features/resume-builder/ResumeBuilderView'
import JobSearchView from '../features/job-search/JobSearchView'
import SettingsView from '../features/settings/SettingsView'

export default function DashboardPage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Active Main Navigation Tab (defaults to active 'skill-gap' module)
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === '/skill-gap') return 'skill-gap'
    return 'skill-gap'
  })

  useEffect(() => {
    if (location.pathname === '/skill-gap') {
      setActiveTab('skill-gap')
    }
  }, [location.pathname])

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'skill-gap') navigate('/skill-gap')
    else navigate('/dashboard')
  }

  // Retrieve user onboarding profile data
  const profileData = (() => {
    try {
      const stored = localStorage.getItem('daksh-onboarding-data-v4')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })()

  // Tab View Dispatcher
  const renderActiveView = () => {
    switch (activeTab) {
      case 'skill-gap':
        return (
          <SkillGapWorkspace
            profileData={profileData}
            onNavigateToRoadmap={() => handleSelectTab('learning-roadmap')}
          />
        )
      case 'home':
        return <HomeView onNavigateToActive={() => handleSelectTab('skill-gap')} />
      case 'learning-roadmap':
        return <LearningRoadmapView onNavigateToActive={() => handleSelectTab('skill-gap')} />
      case 'setu-ai':
        return <SetuAiView onNavigateToActive={() => handleSelectTab('skill-gap')} />
      case 'interview-room':
        return <InterviewRoomView onNavigateToActive={() => handleSelectTab('skill-gap')} />
      case 'resume-builder':
        return <ResumeBuilderView onNavigateToActive={() => handleSelectTab('skill-gap')} />
      case 'job-search':
        return <JobSearchView onNavigateToActive={() => handleSelectTab('skill-gap')} />
      case 'settings':
        return <SettingsView onNavigateToActive={() => handleSelectTab('skill-gap')} />
      default:
        return (
          <SkillGapWorkspace
            profileData={profileData}
            onNavigateToRoadmap={() => handleSelectTab('learning-roadmap')}
          />
        )
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
      {renderActiveView()}
    </DashboardLayout>
  )
}

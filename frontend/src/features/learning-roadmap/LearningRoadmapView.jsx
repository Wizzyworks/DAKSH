import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Trash2 } from 'lucide-react'
import LearningHubEmptyState from './components/LearningHubEmptyState'
import SetuAiWidget from './components/SetuAiWidget'
import CreatePathModal from './components/CreatePathModal'
import GenerationSequence from './components/GenerationSequence'
import FlowMapCanvas from './components/FlowMapCanvas'
import StepDetailDrawer from './components/StepDetailDrawer'
import VideoClassroomView from './components/VideoClassroomView'

// Synchronous, robust initial data extractor to prevent cascading re-render cycles
function getInitialLearningData() {
  try {
    const savedCourseStr = localStorage.getItem('daksh-active-course')
    const savedStepsStr = localStorage.getItem('daksh-learning-steps')

    let parsedCourse = null
    let parsedSteps = []

    if (savedCourseStr) {
      try {
        parsedCourse = JSON.parse(savedCourseStr)
      } catch (e) {
        console.warn('Failed to parse saved course:', e)
      }
    }

    if (savedStepsStr) {
      try {
        parsedSteps = JSON.parse(savedStepsStr)
      } catch (e) {
        console.warn('Failed to parse saved steps:', e)
      }
    }

    // 1. If we have a valid course and steps with items
    if (parsedCourse && Array.isArray(parsedSteps) && parsedSteps.length > 0) {
      return {
        course: parsedCourse,
        steps: parsedSteps,
        screen: 'flow-map',
      }
    }

    // 2. Check if skill-gap handoff exists
    const handoffStr = localStorage.getItem('daksh-active-skill-gap-handoff')
    if (handoffStr) {
      const p = JSON.parse(handoffStr)
      const course = {
        title: `${p.role || 'Full Stack Engineer'} Placement Mastery Path`,
        duration: '6-weeks',
        lectures: [
          { id: 'sg-lec-1', title: `Core Foundations: ${p.confirmedGaps?.[0] || 'System Architecture'}`, duration: '28:15 mins', url: 'https://youtube.com/watch?v=sample1' },
          { id: 'sg-lec-2', title: `Deep Dive: ${p.confirmedGaps?.[1] || 'Concurrency & Memory Models'}`, duration: '34:40 mins', url: 'https://youtube.com/watch?v=sample2' },
          { id: 'sg-lec-3', title: 'Hands-on Production Implementation & Benchmarks', duration: '45:10 mins', url: 'https://youtube.com/watch?v=sample3' },
        ],
        acceptedAiBundles: [
          { id: 'sg-ai-1', title: 'Active Recall Checkpoint: Architecture Synthesis', type: 'quiz' },
          { id: 'sg-ai-2', title: 'Live Coding Challenge: Cache Invalidation Engine', type: 'challenge' },
        ],
      }

      const initialSteps = [
        { id: 'sg-lec-1', stepNumber: '01', title: course.lectures[0].title, type: 'video', duration: course.lectures[0].duration, url: course.lectures[0].url, status: 'current' },
        { id: 'sg-lec-2', stepNumber: '02', title: course.lectures[1].title, type: 'video', duration: course.lectures[1].duration, url: course.lectures[1].url, status: 'upcoming' },
        { id: 'sg-lec-3', stepNumber: '03', title: course.lectures[2].title, type: 'video', duration: course.lectures[2].duration, url: course.lectures[2].url, status: 'upcoming' },
        { id: 'sg-ai-1', stepNumber: '04', title: course.acceptedAiBundles[0].title, type: 'quiz', duration: '15 mins', status: 'upcoming' },
        { id: 'sg-ai-2', stepNumber: '05', title: course.acceptedAiBundles[1].title, type: 'challenge', duration: '45 mins', status: 'upcoming' },
      ]

      try {
        localStorage.setItem('daksh-active-course', JSON.stringify(course))
        localStorage.setItem('daksh-learning-steps', JSON.stringify(initialSteps))
      } catch (err) {
        console.warn('Failed to cache handoff course:', err)
      }

      return {
        course,
        steps: initialSteps,
        screen: 'flow-map',
      }
    }

    // 3. If parsedCourse exists but steps were missing, construct steps synchronously
    if (parsedCourse && (Array.isArray(parsedCourse.lectures) || Array.isArray(parsedCourse.acceptedAiBundles))) {
      const initialSteps = []
      let stepCounter = 1

      if (Array.isArray(parsedCourse.lectures)) {
        parsedCourse.lectures.forEach((lec) => {
          initialSteps.push({
            id: lec.id,
            stepNumber: stepCounter < 10 ? `0${stepCounter}` : `${stepCounter}`,
            title: lec.title,
            type: 'video',
            duration: lec.duration,
            url: lec.url,
            status: stepCounter === 1 ? 'current' : 'upcoming',
          })
          stepCounter++
        })
      }

      if (Array.isArray(parsedCourse.acceptedAiBundles)) {
        parsedCourse.acceptedAiBundles.forEach((ai) => {
          initialSteps.push({
            id: ai.id,
            stepNumber: stepCounter < 10 ? `0${stepCounter}` : `${stepCounter}`,
            title: ai.title,
            type: ai.type,
            duration: ai.type === 'quiz' ? '15 mins' : ai.type === 'challenge' ? '45 mins' : '20 mins',
            status: 'upcoming',
          })
          stepCounter++
        })
      }

      if (initialSteps.length > 0) {
        try {
          localStorage.setItem('daksh-learning-steps', JSON.stringify(initialSteps))
        } catch (err) {
          console.warn('Failed to cache steps:', err)
        }
        return {
          course: parsedCourse,
          steps: initialSteps,
          screen: 'flow-map',
        }
      }
    }
  } catch (e) {
    console.warn('Error reading learning hub initial state:', e)
  }

  return {
    course: null,
    steps: [],
    screen: 'empty',
  }
}

export default function LearningRoadmapView({ onNavigateToActive, onNavigateToHome }) {
  const initialData = getInitialLearningData()
  const [courseData, setCourseData] = useState(initialData.course)
  const [steps, setSteps] = useState(initialData.steps)
  const [currentScreen, setCurrentScreen] = useState(initialData.screen)

  // Sync changes to active course & steps without re-triggering state updates
  useEffect(() => {
    try {
      if (courseData) {
        localStorage.setItem('daksh-active-course', JSON.stringify(courseData))
      }
      if (Array.isArray(steps) && steps.length > 0) {
        localStorage.setItem('daksh-learning-steps', JSON.stringify(steps))
      }
    } catch (e) {
      console.warn('Failed to sync learning state to localStorage:', e)
    }
  }, [courseData, steps])

  // Create Path Floating Studio Modal Open State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Drawer & Classroom selection state
  const [selectedDrawerStep, setSelectedDrawerStep] = useState(null)
  const [activeClassroomStep, setActiveClassroomStep] = useState(null)

  // Delete Path confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteToast, setDeleteToast] = useState('')

  // Open the Floating Studio
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  // Handle compilation from Step 3 of the studio
  const handleGenerateMap = (compiledCourse) => {
    setCourseData(compiledCourse)

    const initialSteps = []
    let stepCounter = 1

    const lectures = Array.isArray(compiledCourse?.lectures) ? compiledCourse.lectures : []
    lectures.forEach((lec) => {
      initialSteps.push({
        id: lec.id,
        stepNumber: stepCounter < 10 ? `0${stepCounter}` : `${stepCounter}`,
        title: lec.title,
        type: 'video',
        duration: lec.duration,
        url: lec.url,
        status: stepCounter === 1 ? 'current' : 'upcoming',
      })
      stepCounter++
    })

    const bundles = Array.isArray(compiledCourse?.acceptedAiBundles) ? compiledCourse.acceptedAiBundles : []
    bundles.forEach((ai) => {
      initialSteps.push({
        id: ai.id,
        stepNumber: stepCounter < 10 ? `0${stepCounter}` : `${stepCounter}`,
        title: ai.title,
        type: ai.type,
        duration: ai.type === 'quiz' ? '15 mins' : ai.type === 'challenge' ? '45 mins' : '20 mins',
        status: 'upcoming',
      })
      stepCounter++
    })

    setSteps(initialSteps)
    try {
      localStorage.setItem('daksh-active-course', JSON.stringify(compiledCourse))
      localStorage.setItem('daksh-learning-steps', JSON.stringify(initialSteps))
    } catch (e) {
      console.warn(e)
    }

    setIsCreateModalOpen(false)
    setCurrentScreen('generating')
  }

  // When 2.8s generation animation completes
  const handleGenerationComplete = () => {
    setCurrentScreen('flow-map')
  }

  // Node selection from Flow Map
  const handleSelectStep = (stepNode) => {
    setSelectedDrawerStep(stepNode)
  }

  // Launch Video Classroom from drawer
  const handleOpenClassroom = (stepNode) => {
    setActiveClassroomStep(stepNode)
    setSelectedDrawerStep(null)
    setCurrentScreen('classroom')
  }

  // Complete a lecture and advance roadmap telemetry
  const handleCompleteLecture = (stepId) => {
    setSteps((prevSteps) => {
      let foundCompleted = false
      const updated = prevSteps.map((s) => {
        if (s.id === stepId) {
          foundCompleted = true
          return { ...s, status: 'completed' }
        }
        if (foundCompleted && s.status === 'upcoming') {
          foundCompleted = false
          return { ...s, status: 'current' }
        }
        return s
      })
      try {
        localStorage.setItem('daksh-learning-steps', JSON.stringify(updated))
      } catch (e) {
        console.warn(e)
      }
      return updated
    })

    setCurrentScreen('flow-map')
    setActiveClassroomStep(null)
  }

  // Delete / Remove an individual step from the roadmap
  const handleDeleteSingleStep = (stepId) => {
    const remainingSteps = steps.filter((s) => s.id !== stepId)
    const reindexed = remainingSteps.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
    }))

    // If the deleted step was current, promote next upcoming step
    const hasCurrent = reindexed.some((s) => s.status === 'current')
    const hasCompleted = reindexed.some((s) => s.status === 'completed')
    if (!hasCurrent && reindexed.length > 0) {
      const nextUpcoming = reindexed.find((s) => s.status === 'upcoming')
      if (nextUpcoming) {
        nextUpcoming.status = 'current'
      } else if (!hasCompleted && reindexed[0]) {
        reindexed[0].status = 'current'
      }
    }

    setSteps(reindexed)

    if (courseData) {
      const updatedCourse = {
        ...courseData,
        lectures: (courseData.lectures || []).filter((l) => l.id !== stepId),
        acceptedAiBundles: (courseData.acceptedAiBundles || []).filter((b) => b.id !== stepId),
      }
      setCourseData(updatedCourse)
      try {
        localStorage.setItem('daksh-active-course', JSON.stringify(updatedCourse))
      } catch (e) {
        console.warn(e)
      }
    }

    try {
      localStorage.setItem('daksh-learning-steps', JSON.stringify(reindexed))
    } catch (e) {
      console.warn(e)
    }

    setSelectedDrawerStep(null)

    if (reindexed.length === 0) {
      setCurrentScreen('empty')
      setDeleteToast('All steps removed. Learning path cleared.')
    } else {
      setDeleteToast('Step removed from your learning roadmap.')
    }
    setTimeout(() => setDeleteToast(''), 3000)
  }

  // Delete / Reset Learning Path Action
  const handleConfirmDeletePath = () => {
    try {
      localStorage.removeItem('daksh-active-course')
      localStorage.removeItem('daksh-learning-steps')
      localStorage.removeItem('daksh-active-skill-gap-handoff')
    } catch (e) {
      console.warn(e)
    }

    setCourseData(null)
    setSteps([])
    setSelectedDrawerStep(null)
    setActiveClassroomStep(null)
    setShowDeleteModal(false)
    setCurrentScreen('empty')

    setDeleteToast('Learning path deleted successfully.')
    setTimeout(() => setDeleteToast(''), 3500)
  }

  return (
    <div
      className="learning-hub-content-container"
      style={{
        position: 'relative',
        minHeight: '100%',
        width: '100%',
        fontFamily: "var(--font-sans, 'Inter', sans-serif)",
      }}
    >
      {/* Toast Alert */}
      {deleteToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: 'var(--surface-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: 'var(--success)' }}>✓</span>
          <span>{deleteToast}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Screen 1: Empty State */}
        {currentScreen === 'empty' && (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <LearningHubEmptyState
              onCreatePath={handleOpenCreateModal}
              onNavigateToHome={onNavigateToHome}
            />
          </motion.div>
        )}

        {/* Screen 2: Generation Animation */}
        {currentScreen === 'generating' && (
          <motion.div
            key="generating-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <GenerationSequence
              courseData={courseData}
              onComplete={handleGenerationComplete}
            />
          </motion.div>
        )}

        {/* Screen 3: Serpentine Flow Map */}
        {currentScreen === 'flow-map' && (
          <motion.div
            key="flow-map-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <FlowMapCanvas
              courseData={courseData}
              steps={steps}
              onSelectStep={handleSelectStep}
              onAddActivity={handleOpenCreateModal}
              onBackToOverview={() => setCurrentScreen('empty')}
              onNavigateToHome={onNavigateToHome}
              onDeletePath={() => setShowDeleteModal(true)}
              onOpenSettings={() => {}}
            />
          </motion.div>
        )}

        {/* Screen 4: Video Classroom View */}
        {currentScreen === 'classroom' && (
          <motion.div
            key="classroom-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <VideoClassroomView
              step={activeClassroomStep}
              courseTitle={courseData?.title}
              onBackToMap={() => setCurrentScreen('flow-map')}
              onCompleteLecture={handleCompleteLecture}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Delete Learning Path */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 14, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="matte-card"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              borderRadius: '20px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: 'var(--error)' }}>
              <Trash2 size={22} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                Delete Learning Path?
              </h3>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '22px' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>"{courseData?.title || 'Active Learning Path'}"</strong>? All lecture completion telemetry and spaced-repetition milestones will be permanently cleared.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline btn-sm"
                style={{ padding: '8px 18px', borderRadius: '99px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePath}
                className="btn btn-sm"
                style={{
                  padding: '8px 20px',
                  borderRadius: '99px',
                  background: 'var(--error)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Yes, Delete Path
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating 3-Step Course Creation Studio Modal */}
      <CreatePathModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGenerateMap={handleGenerateMap}
      />

      {/* Slide-over Step Details Drawer */}
      <StepDetailDrawer
        selectedStep={selectedDrawerStep}
        onClose={() => setSelectedDrawerStep(null)}
        onOpenClassroom={handleOpenClassroom}
        onMarkCompleted={handleCompleteLecture}
        onDeleteStep={handleDeleteSingleStep}
      />

      {/* In-Hub SETU AI Co-Pilot Widget (Bottom-Right Docked) */}
      <SetuAiWidget onCreatePath={handleOpenCreateModal} />
    </div>
  )
}

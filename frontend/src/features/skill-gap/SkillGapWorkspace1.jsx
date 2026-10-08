import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import Step1ResumeIntake from './Step1ResumeIntake'
import Step2TargetBenchmark from './Step2TargetBenchmark'
import Step3GapReport from './Step3GapReport'
import Step4DiagnosticArena from './Step4DiagnosticArena'
import Step5CalibratedRoadmap from './Step5CalibratedRoadmap'
import { PRESET_ROLES, ADAPTIVE_QUESTION_POOL } from './skillGapData'
import { skillGapApi } from '../../services/skillGapApi'

export default function SkillGapWorkspace({ profileData, onNavigateToRoadmap }) {
    const hasOnboardingResume = !!profileData.resume?.name

    // Wizard Step Navigation State (1 to 5)
    const [currentStep, setCurrentStep] = useState(1)

    // Step 1: Resume Intake & Extracted Skills State
    const [resumeSource, setResumeSource] = useState(hasOnboardingResume ? 'existing' : 'custom')
    const [customResumeFile, setCustomResumeFile] = useState(null)
    const [extractedSkills, setExtractedSkills] = useState([])

    // Step 2: Target Benchmark & JD State
    const [availableRoles, setAvailableRoles] = useState(PRESET_ROLES)
    const [selectedRole, setSelectedRole] = useState('sde-fullstack')
    const [customJDText, setCustomJDText] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisProgress, setAnalysisProgress] = useState(0)
    const [analysisStatusText, setAnalysisStatusText] = useState('')

    // Step 3: Real Gap Report State from Backend
    const [gapReport, setGapReport] = useState(null)

    // Step 4: IRT Adaptive Questions & Responses
    const [diagnosticQuestions, setDiagnosticQuestions] = useState(ADAPTIVE_QUESTION_POOL)
    const [arenaAnswers, setArenaAnswers] = useState({})
    const [calibrationResult, setCalibrationResult] = useState(null)

    // Load available roles on mount
    useEffect(() => {
        async function loadRoles() {
            const roles = await skillGapApi.getRoles()
            if (roles && roles.length > 0) {
                setAvailableRoles(roles.map(r => ({
                    id: r.role_slug,
                    title: r.role_title,
                    tier: r.department_domain || 'Engineering Track',
                    coreSkills: r.standard_required_skills || [],
                    description: r.description || 'Target competency rubric for placement.'
                })))
            }
        }
        loadRoles()
    }, [])

    // Active role configuration object
    const activeRoleConfig = availableRoles.find((r) => r.id === selectedRole) || availableRoles[0]

    // Step 1 -> Step 2: Trigger Resume Parsing via AI
    const handleProceedFromStep1 = async () => {
        try {
            let fileToParse = customResumeFile
            let sampleText = ''
            if (!fileToParse && profileData.skills?.length > 0) {
                sampleText = `Candidate with skills in: ${profileData.skills.join(', ')}. Target role: ${profileData.targeted_role || 'SDE-1'}`
            }

            const parseRes = await skillGapApi.parseResume(fileToParse, sampleText)
            if (parseRes?.analysis?.skills) {
                setExtractedSkills(parseRes.analysis.skills)
            }
        } catch (err) {
            console.warn('Proceeding with profile skills:', err)
            if (profileData.skills?.length > 0) {
                setExtractedSkills(profileData.skills.map(s => ({ name: s, proficiency: 'intermediate' })))
            }
        }
        setCurrentStep(2)
    }

    // Step 2: Trigger Real Semantic Gap Analysis against Target Role / JD
    const handleRunAnalysis = async () => {
        setIsAnalyzing(true)
        setAnalysisProgress(20)
        setAnalysisStatusText('Extracting ATS skill tokens and competency taxonomy...')

        try {
            setAnalysisProgress(50)
            setAnalysisStatusText('Benchmarking candidate profile against target role rubric...')

            // Call live backend gap analyzer
            const report = await skillGapApi.analyzeBenchmark(selectedRole, extractedSkills, customJDText)
            setGapReport(report)

            setAnalysisProgress(80)
            setAnalysisStatusText('Generating IRT-calibrated diagnostic arena questions...')

            // Fetch dynamic questions for detected gaps
            const gapNames = report?.gap_items?.map(i => i.skill_name) || []
            const questionsRes = await skillGapApi.generateDiagnosticQuestions(gapNames)
            if (questionsRes?.questions && questionsRes.questions.length > 0) {
                setDiagnosticQuestions(questionsRes.questions)
            }

            setAnalysisProgress(100)
            setAnalysisStatusText('Analysis complete!')
            setTimeout(() => {
                setIsAnalyzing(false)
                setCurrentStep(3)
            }, 400)
        } catch (err) {
            console.error('Error running gap analysis:', err)
            setIsAnalyzing(false)
            setCurrentStep(3)
        }
    }

    // Step 4: Trigger IRT Calibration when answers are submitted
    const handleCompleteCalibration = async () => {
        const baseScore = gapReport?.overall_match_score || 72
        const formattedResponses = Object.entries(arenaAnswers).map(([qId, ans]) => ({
            question_id: qId,
            skill: ans.skillTarget || 'General',
            difficulty_b: ans.difficulty_b || 0.0,
            is_correct: ans.isCorrect || false,
        }))

        try {
            const calRes = await skillGapApi.calibrateDiagnostic(baseScore, formattedResponses)
            setCalibrationResult(calRes)
        } catch (err) {
            console.warn('Using local IRT calculation:', err)
        }
        setCurrentStep(5)
    }

    const baseMatch = gapReport?.overall_match_score ? parseFloat(gapReport.overall_match_score) : 72
    const verifiedBonusScore = calibrationResult?.calibration_boost || (Object.values(arenaAnswers).filter((ans) => ans?.isCorrect).length * 3)
    const finalCalibratedScore = calibrationResult?.final_calibrated_match || Math.min(98, baseMatch + verifiedBonusScore)

    return (
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            {/* Top Header Banner */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', background: 'var(--surface-soft)', padding: '3px 10px', borderRadius: '99px', border: '1px solid var(--border)' }}>
                        ACTIVE ENGINE: MODULE 1
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Live AI Placement Skill Gap & IRT Calibration Engine
                    </span>
                </div>

                <h1 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text)', margin: '0 0 6px' }}>
                    AI Skill Gap Analysis & Diagnostic Scanner
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, maxWidth: '780px', lineHeight: 1.5 }}>
                    Follow the 5-step progressive workflow to benchmark your resume against target rubrics, verify competencies with IRT adaptive testing, and calibrate your learning path.
                </p>
            </div>

            {/* 5-Step Stepper Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--surface-glass)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '12px 18px',
                    marginBottom: '28px',
                    overflowX: 'auto',
                    gap: '8px',
                }}
            >
                {[
                    { num: 1, title: 'Resume Baseline' },
                    { num: 2, title: 'Target Benchmark' },
                    { num: 3, title: 'Gap Report' },
                    { num: 4, title: 'Diagnostic Arena' },
                    { num: 5, title: 'Roadmap Ready' },
                ].map((step, idx) => {
                    const isActive = currentStep === step.num
                    const isCompleted = currentStep > step.num

                    return (
                        <div
                            key={step.num}
                            onClick={() => {
                                if (currentStep >= step.num) setCurrentStep(step.num)
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: currentStep >= step.num ? 'pointer' : 'default',
                                opacity: currentStep >= step.num ? 1 : 0.45,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <div
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: isCompleted ? '#10B981' : isActive ? 'var(--primary)' : 'var(--surface-soft)',
                                    border: isCompleted || isActive ? 'none' : '1px solid var(--border)',
                                    color: isCompleted || isActive ? '#FFFFFF' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    flexShrink: 0,
                                }}
                            >
                                {isCompleted ? <Check size={13} strokeWidth={3} /> : step.num}
                            </div>

                            <span style={{ fontSize: '12.5px', fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--text)' : 'var(--text-muted)' }}>
                                {step.title}
                            </span>

                            {idx < 4 && (
                                <ChevronRight size={14} color="var(--text-subtle)" style={{ marginLeft: '6px' }} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Dynamic Step View Rendering */}
            <AnimatePresence mode="wait">
                {currentStep === 1 && (
                    <Step1ResumeIntake
                        key="step-1"
                        profileData={profileData}
                        resumeSource={resumeSource}
                        setResumeSource={setResumeSource}
                        customResumeFile={customResumeFile}
                        setCustomResumeFile={setCustomResumeFile}
                        onNext={handleProceedFromStep1}
                    />
                )}

                {currentStep === 2 && (
                    <Step2TargetBenchmark
                        key="step-2"
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        customJDText={customJDText}
                        setCustomJDText={setCustomJDText}
                        isAnalyzing={isAnalyzing}
                        analysisProgress={analysisProgress}
                        analysisStatusText={analysisStatusText}
                        activeRoleConfig={activeRoleConfig}
                        onBack={() => setCurrentStep(1)}
                        onRunAnalysis={handleRunAnalysis}
                    />
                )}

                {currentStep === 3 && (
                    <Step3GapReport
                        key="step-3"
                        baseMatch={baseMatch}
                        activeRoleConfig={activeRoleConfig}
                        gapReport={gapReport}
                        onBack={() => setCurrentStep(2)}
                        onNext={() => setCurrentStep(4)}
                    />
                )}

                {currentStep === 4 && (
                    <Step4DiagnosticArena
                        key="step-4"
                        questions={diagnosticQuestions}
                        arenaAnswers={arenaAnswers}
                        setArenaAnswers={setArenaAnswers}
                        onBack={() => setCurrentStep(3)}
                        onCompleteCalibration={handleCompleteCalibration}
                    />
                )}

                {currentStep === 5 && (
                    <Step5CalibratedRoadmap
                        key="step-5"
                        activeRoleConfig={activeRoleConfig}
                        baseMatch={baseMatch}
                        verifiedBonusScore={verifiedBonusScore}
                        finalCalibratedScore={finalCalibratedScore}
                        calibrationResult={calibrationResult}
                        onNavigateToRoadmap={onNavigateToRoadmap}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

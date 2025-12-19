'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    PlayCircle, CheckCircle, ChevronLeft, ChevronRight,
    Menu, FileText, Download, Award, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { getCourseById, getCourseProgress, updateCourseProgress, HelperCourse, Lesson, Video, Quiz } from '@/lib/courseService';
import { submitQuiz as submitQuizAPI } from '@/lib/quizService';
import { toast } from 'sonner';
import { QuizComponent } from '@/components/quiz-component';
import type { QuizAttempt } from '@/types/course';
import { useEnrollment } from '@/context/enrollment-context';

interface CourseLearningPageProps {
    courseId: string;
}

const CourseLearningPage: React.FC<CourseLearningPageProps> = ({ courseId }) => {
    const { isEnrolled, isLoading: isEnrollmentLoading } = useEnrollment();
    const [course, setCourse] = useState<HelperCourse | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [lessonNotes, setLessonNotes] = useState<Record<string, string>>({});
    const [currentNoteText, setCurrentNoteText] = useState<string>('');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const router = useRouter();

    // Show loading while checking enrollment
    if (isEnrollmentLoading) {
        console.log(`[CourseLearningPage] Enrollment loading for course: ${courseId}`);
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Checking enrollment status...</p>
                </div>
            </div>
        );
    }

    // Check enrollment before allowing access - BUT only after enrollment data is loaded
    useEffect(() => {
        // Don't check enrollment while still loading
        if (isEnrollmentLoading) {
            console.log(`[CourseLearningPage] Enrollment still loading, skipping check`);
            return;
        }

        console.log(`[CourseLearningPage] Checking enrollment for course: ${courseId}`);
        console.log(`[CourseLearningPage] isEnrolled function:`, typeof isEnrolled);

        const enrolled = isEnrolled(courseId);
        console.log(`[CourseLearningPage] Enrollment result for course ${courseId}:`, enrolled);

        if (!enrolled) {
            console.log(`[CourseLearningPage] User not enrolled in course ${courseId}, redirecting to course page`);
            toast.error("You need to enroll in this course first", {
                description: "Redirecting you to the course page...",
            });
            router.push(`/courses/${courseId}`);
            return;
        } else {
            console.log(`[CourseLearningPage] User is enrolled, proceeding with course loading`);
        }
    }, [courseId, isEnrolled, isEnrollmentLoading, router]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                console.log(`[CourseLearningPage] Fetching data for courseId: ${courseId}`);
                const [courseData, progressData] = await Promise.all([
                    getCourseById(courseId),
                    getCourseProgress(courseId).catch(err => {
                        console.error('Error fetching progress:', err);
                        return null;
                    })
                ]);

                console.log('[CourseLearningPage] Data received:', { courseData, progressData });
                setCourse(courseData);

                if (progressData) {
                    setCompletedLessons(progressData.completedLessons);
                }

                // Determine initial lesson
                let initialLesson: Lesson | null = null;

                // 1. Try last accessed from backend
                if (progressData?.lastAccessedLessonId) {
                    // Search for this lesson in curriculum
                    for (const module of courseData.curriculum) {
                        const found = module.lessons.find(l => l.lessonId === progressData.lastAccessedLessonId);
                        if (found) {
                            initialLesson = found;
                            break;
                        }
                    }
                }

                // 2. If not found, use first lesson
                if (!initialLesson && courseData.curriculum && courseData.curriculum.length > 0) {
                    const firstModuleWithLessons = courseData.curriculum.find(m => m.lessons && m.lessons.length > 0);
                    if (firstModuleWithLessons && firstModuleWithLessons.lessons.length > 0) {
                        initialLesson = firstModuleWithLessons.lessons[0];
                    }
                }

                if (initialLesson) {
                    console.log('[CourseLearningPage] Setting initial lesson:', initialLesson);
                    setCurrentLesson(initialLesson);
                }

            } catch (error) {
                console.error('[CourseLearningPage] Error fetching course:', error);
                toast.error("Failed to load course content");
            }
        };

        fetchCourseData();
    }, [courseId]);

    // Update video URL when currentLesson changes
    useEffect(() => {
        if (course && currentLesson) {
            if (currentLesson.type === 'video') {
                const videoData = course.videos.find(v => v.id === currentLesson.resourceId);
                console.log(`[CourseLearningPage] Resolving video URL for lesson ${currentLesson.title}. ResourceID: ${currentLesson.resourceId}`, videoData);
                if (videoData) {
                    setVideoUrl(videoData.url);
                    setCurrentQuiz(null);
                } else {
                    console.warn('[CourseLearningPage] Video resource not found for lesson:', currentLesson);
                    setVideoUrl('');
                }
            } else if (currentLesson.type === 'quiz') {
                const quizData = course.quizzes?.find(q => q.id === currentLesson.resourceId);
                console.log(`[CourseLearningPage] Resolving quiz for lesson ${currentLesson.title}. ResourceID: ${currentLesson.resourceId}`, quizData);
                if (quizData) {
                    setCurrentQuiz(quizData);
                    setVideoUrl('');
                } else {
                    console.warn('[CourseLearningPage] Quiz resource not found for lesson:', currentLesson);
                    setCurrentQuiz(null);
                }
            } else {
                setVideoUrl('');
                setCurrentQuiz(null);
            }
        }
    }, [course, currentLesson]);

    const handleLessonClick = async (lesson: Lesson) => {
        console.log('[CourseLearningPage] Lesson clicked:', lesson);
        setCurrentLesson(lesson);
        // Optimistically update last accessed in backend (fire and forget)
        try {
            // We pass false to completed to just update the last accessed lesson without toggling completion
            // Actually, the API expects 'completed' boolean to toggle completion list.
            // If we just want to update last accessed, we might need to send the current completion status of this lesson.
            const isCompleted = completedLessons.includes(lesson.lessonId);
            await updateCourseProgress(courseId, lesson.lessonId, isCompleted);
        } catch (err) {
            console.error('Failed to update last visited lesson', err);
        }
    };

    const toggleCompletion = async (lessonId: string) => {
        console.log('[CourseLearningPage] Toggling completion for:', lessonId);

        // Optimistic update
        const isCurrentlyCompleted = completedLessons.includes(lessonId);
        const newCompletedStatus = !isCurrentlyCompleted;

        setCompletedLessons(prev =>
            newCompletedStatus
                ? [...prev, lessonId]
                : prev.filter(id => id !== lessonId)
        );

        try {
            await updateCourseProgress(courseId, lessonId, newCompletedStatus);
            if (newCompletedStatus) {
                toast.success("Progress saved!");
            }
        } catch (error) {
            console.error('Failed to update progress backend:', error);
            toast.error("Failed to save progress");
            // Revert on failure
            setCompletedLessons(prev =>
                isCurrentlyCompleted
                    ? [...prev, lessonId]
                    : prev.filter(id => id !== lessonId)
            );
        }
    };

    const handleQuizComplete = async (attempt: QuizAttempt) => {
        console.log('[CourseLearningPage] Quiz completed:', attempt);

        if (!currentLesson || !currentQuiz) return;

        try {
            // Convert answers object to match backend format (indexed by question index)
            const answersArray: Record<string, string> = {};
            Object.entries(attempt.answers).forEach(([key, value]) => {
                answersArray[key] = value;
            });

            const result = await submitQuizAPI(courseId, currentQuiz.id, answersArray);

            console.log('[CourseLearningPage] Quiz submission result:', result);

            if (result.data.passed) {
                toast.success(`Quiz passed with ${result.data.percentage}%!`);
                // Mark quiz as completed
                await toggleCompletion(currentLesson.lessonId);
            } else {
                toast.info(`Quiz score: ${result.data.percentage}%. You can retake it.`);
            }
        } catch (error) {
            console.error('[CourseLearningPage] Error submitting quiz:', error);
            toast.error("Failed to submit quiz. Please try again.");
        }
    };

    const getNextLesson = (): Lesson | null => {
        if (!course || !currentLesson) return null;

        let found = false;
        for (const module of course.curriculum) {
            for (const lesson of module.lessons || []) {
                if (found) {
                    return lesson;
                }
                if (lesson.lessonId === currentLesson.lessonId) {
                    found = true;
                }
            }
        }
        return null;
    };

    const getPreviousLesson = (): Lesson | null => {
        if (!course || !currentLesson) return null;

        let previousLesson: Lesson | null = null;
        for (const module of course.curriculum) {
            for (const lesson of module.lessons || []) {
                if (lesson.lessonId === currentLesson.lessonId) {
                    return previousLesson;
                }
                previousLesson = lesson;
            }
        }
        return null;
    };

    const handleNextLesson = async () => {
        const nextLesson = getNextLesson();
        if (nextLesson) {
            await handleLessonClick(nextLesson);
        } else {
            toast.info("You've reached the last lesson!");
        }
    };

    const handlePreviousLesson = async () => {
        const previousLesson = getPreviousLesson();
        if (previousLesson) {
            await handleLessonClick(previousLesson);
        } else {
            toast.info("This is the first lesson!");
        }
    };

    // Load notes when lesson changes
    useEffect(() => {
        if (currentLesson) {
            setCurrentNoteText(lessonNotes[currentLesson.lessonId] || '');
        }
    }, [currentLesson, lessonNotes]);

    const handleSaveNote = () => {
        if (!currentLesson) return;

        setIsSavingNote(true);
        // Save to state (in a real app, this would save to backend)
        setLessonNotes(prev => ({
            ...prev,
            [currentLesson.lessonId]: currentNoteText
        }));

        // Simulate save delay
        setTimeout(() => {
            setIsSavingNote(false);
            toast.success('Note saved!');
        }, 500);
    };

    const getTotalLessons = () => {
        if (!course) return 0;
        return course.curriculum.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
    };

    const progress = course && getTotalLessons() > 0
        ? Math.round((completedLessons.length / getTotalLessons()) * 100)
        : 0;

    if (!course) {
        return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading course content...</div>;
    }

    if (!currentLesson) {
        // This state might occur if course has no content
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <h2 className="text-xl mb-4">No content available for this course.</h2>
                    <Button onClick={() => router.push('/mycourses')}>Back to My Courses</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white font-sans overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="font-bold text-orange-400 cursor-pointer" onClick={() => router.push('/')}>Skillfinite</div>
                    <div className="h-6 w-px bg-gray-700 mx-2 hidden sm:block"></div>
                    <div className="text-sm font-medium truncate max-w-md hidden sm:block">{course.title}</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="hidden sm:inline">Your Progress:</span>
                        <span className="font-bold">{progress}%</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={() => router.push(`/courses/${courseId}`)}>
                        Go to Course Page
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content (Video Player / Quiz) */}
                <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
                    {/* Video Player / Quiz Container */}
                    {currentLesson.type === 'quiz' && currentQuiz ? (
                        <div className="p-6 bg-gray-50">
                            <QuizComponent
                                quiz={currentQuiz}
                                onQuizComplete={handleQuizComplete}
                                className="max-w-4xl mx-auto"
                            />
                        </div>
                    ) : (
                        <div className="bg-black w-full aspect-video relative flex items-center justify-center group">
                            {videoUrl ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                        onEnded={() => {
                                            console.log('[CourseLearningPage] Video ended');
                                            if (currentLesson) toggleCompletion(currentLesson.lessonId);
                                        }}
                                        onLoadedMetadata={() => {
                                            if (videoRef.current) {
                                                videoRef.current.playbackRate = playbackSpeed;
                                            }
                                        }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>

                                    {/* Playback Speed Control */}
                                    <div className="absolute bottom-16 right-4 bg-black/80 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-white text-xs mb-1">Speed</div>
                                        <div className="flex gap-1">
                                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                                <button
                                                    key={speed}
                                                    onClick={() => {
                                                        setPlaybackSpeed(speed);
                                                        if (videoRef.current) {
                                                            videoRef.current.playbackRate = speed;
                                                        }
                                                    }}
                                                    className={`px-2 py-1 rounded text-xs ${playbackSpeed === speed
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {speed}x
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-white text-center p-10">
                                    <h3 className="text-xl font-bold mb-2">{currentLesson.title}</h3>
                                    <p className="text-gray-400">Content type: {currentLesson.type}</p>
                                    {currentLesson.type !== 'video' && currentLesson.type !== 'quiz' && <p className="mt-4">This content is not a video. View below.</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Lesson Navigation Buttons */}
                    <div className="bg-white border-t border-gray-200 px-6 py-4">
                        <div className="flex justify-between items-center max-w-4xl">
                            <Button
                                variant="outline"
                                onClick={handlePreviousLesson}
                                disabled={!getPreviousLesson()}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous Lesson
                            </Button>

                            <div className="text-sm text-gray-600">
                                {currentLesson && (
                                    <span>
                                        {course.curriculum.findIndex(m => m.lessons.some(l => l.lessonId === currentLesson.lessonId)) + 1} of {course.curriculum.length} modules
                                    </span>
                                )}
                            </div>

                            <Button
                                onClick={handleNextLesson}
                                disabled={!getNextLesson()}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                            >
                                Next Lesson
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Below Video Controls / Tabs */}
                    <div className="flex flex-col flex-1">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 px-6">
                            {['Overview', 'Q&A', 'Notes', 'Announcements'].map(tab => (
                                <button
                                    key={tab}
                                    className={`px-4 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 max-w-4xl">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                                        <p className="text-gray-700">{course.description}</p>
                                    </div>

                                    {/* Mock resources */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Resources</h3>
                                        {course.documents && course.documents.length > 0 ? (
                                            <div className="flex flex-wrap gap-4">
                                                {course.documents.map(doc => (
                                                    <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50 cursor-pointer text-gray-700">
                                                        <FileText className="w-4 h-4" />
                                                        <span>{doc.fileName || doc.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No resources available.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'notes' && (
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-lg font-bold text-gray-900">My Notes</h3>
                                            <div className="text-xs text-gray-500">
                                                {currentNoteText.length} characters
                                            </div>
                                        </div>
                                        <textarea
                                            value={currentNoteText}
                                            onChange={(e) => setCurrentNoteText(e.target.value)}
                                            placeholder="Take notes for this lesson..."
                                            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentNoteText(lessonNotes[currentLesson?.lessonId || ''] || '')}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={handleSaveNote}
                                            disabled={isSavingNote}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            {isSavingNote ? 'Saving...' : 'Save Note'}
                                        </Button>
                                    </div>
                                    {Object.keys(lessonNotes).length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h4 className="text-sm font-bold text-gray-700 mb-2">Notes from other lessons ({Object.keys(lessonNotes).length})</h4>
                                            <div className="space-y-2 text-xs text-gray-600">
                                                {Object.entries(lessonNotes).map(([lessonId, note]) => {
                                                    if (lessonId === currentLesson?.lessonId) return null;
                                                    const lesson = course.curriculum.flatMap(m => m.lessons).find(l => l.lessonId === lessonId);
                                                    return (
                                                        <div key={lessonId} className="p-2 bg-gray-50 rounded">
                                                            <div className="font-semibold text-gray-900">{lesson?.title || 'Unknown Lesson'}</div>
                                                            <div className="mt-1 line-clamp-2">{note}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'q&a' && (
                                <div className="text-center py-10 text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-bold text-gray-900">No questions asked yet</h3>
                                    <p>Be the first to ask a question!</p>
                                    <Button className="mt-4">Ask a question</Button>
                                </div>
                            )}
                            {activeTab === 'announcements' && (
                                <div className="text-center py-10 text-gray-500">
                                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-bold text-gray-900">No announcements yet</h3>
                                    <p>Check back later for course updates!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Curriculum) */}
                <div className={`w-80 md:w-96 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col transition-all duration-300 ${isSidebarOpen ? '' : 'hidden'}`}>
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Course Content</h3>
                        <div className="text-xs text-gray-500 cursor-pointer hover:text-indigo-600 sm:hidden" onClick={() => setIsSidebarOpen(false)}>Close</div>
                    </div>

                    <ScrollArea className="flex-1">
                        <Accordion type="multiple" defaultValue={course.curriculum.map(m => `module-${m.moduleId}`)} className="w-full">
                            {course.curriculum.map((module) => (
                                <AccordionItem key={module.moduleId} value={`module-${module.moduleId}`} className="border-b border-gray-100">
                                    <AccordionTrigger className="bg-gray-50 px-4 py-3 hover:bg-gray-100 no-underline hover:no-underline">
                                        <div className="text-left w-full">
                                            <div className="font-bold text-gray-900 text-sm mb-1">{module.title}</div>
                                            <div className="text-xs text-gray-500 font-normal">
                                                {module.lessons.filter(l => completedLessons.includes(l.lessonId)).length} / {module.lessons.length}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0">
                                        <div className="bg-white">
                                            {module.lessons.map((lesson) => {
                                                const isCompleted = completedLessons.includes(lesson.lessonId);
                                                const isActive = currentLesson?.lessonId === lesson.lessonId;
                                                // Resolve duration if possible - video object has it?
                                                const videoData = lesson.type === 'video' ? course.videos.find(v => v.id === lesson.resourceId) : null;
                                                const duration = videoData?.duration || '';

                                                return (
                                                    <div
                                                        key={lesson.lessonId}
                                                        className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${isActive ? 'bg-gray-100 border-gray-900' : 'border-transparent'}`}
                                                        onClick={() => handleLessonClick(lesson)}
                                                    >
                                                        <div className="mt-1" onClick={(e) => { e.stopPropagation(); toggleCompletion(lesson.lessonId); }}>
                                                            {isCompleted ? (
                                                                <div className="bg-indigo-600 rounded-sm p-0.5"><CheckCircle className="w-4 h-4 text-white" /></div>
                                                            ) : (
                                                                <div className="w-5 h-5 border border-gray-400 rounded-sm hover:border-indigo-600"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className={`text-sm ${isActive ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{lesson.title}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <PlayCircle className="w-3 h-3 text-gray-400" />
                                                                {duration && <span className="text-xs text-gray-500">{duration}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

// Icons needed
const Trophy = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
);

export default CourseLearningPage;

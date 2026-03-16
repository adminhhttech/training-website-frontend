import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import {
    MessageSquare, Calendar, Mic, Sparkles, Shield, Zap,
    ArrowLeft, X, Brain, GraduationCap, Building
} from 'lucide-react';
import { Sidebar } from '@/components/student/Sidebar';
import MentorNavbar from '../components/MentorNavbar';
import styles from '../styles/IndexPage.module.css';



// Mentor type options
const mentorTypes = [
    { id: 'ai', label: 'AI Mentor', icon: Brain },
    { id: 'top-institutes', label: 'Top Institutes Mentor', icon: GraduationCap },
    { id: 'corporate', label: 'Corporate Mentor', icon: Building },
];

const IndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<'corporate' | 'student' | null>(null);
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
    const [selectedMentorType, setSelectedMentorType] = useState<string | null>(null);
    const [step, setStep] = useState<'profile' | 'callOptions' | 'schedule'>('profile');
    const [message, setMessage] = useState('');
    const [activeMenuItem, setActiveMenuItem] = useState('mentor');
    const [scrolled, setScrolled] = useState(false);
    const [showNav, setShowNav] = useState(true);
    const [mobileMenu, setMobileMenu] = useState(false);

    // Handle sidebar menu clicks
    const handleMenuItemClick = (id: string) => {
        setActiveMenuItem(id);
        switch (id) {
            case 'home':
                navigate('/dashboard');
                break;
            case 'forum':
                navigate('/dashboard', { state: { openComponent: 'forum' } });
                break;
            case 'resume-lab':
                navigate('/resume-builder');
                break;
            case 'mock-test':
                navigate('/dashboard', { state: { openComponent: 'mock-test' } });
                break;
            case 'mentor':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            default:
                break;
        }
    };

    // Scroll effect for navbar
    useEffect(() => {
        let lastY = window.scrollY;
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 10);
            if (currentY > lastY && currentY > 80) {
                setShowNav(false);
                setMobileMenu(false);
            } else {
                setShowNav(true);
            }
            lastY = currentY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Call ended message
    useEffect(() => {
        if (localStorage.getItem('callEnded') === 'true') {
            setMessage('🎉 Thank you for connecting with us!<br>We hope the session was valuable. Feel free to schedule another call anytime.');
            localStorage.removeItem('callEnded');
            setTimeout(() => setMessage(''), 5000);
        }
    }, []);

    const handleTypeSelect = (type: 'corporate' | 'student') => setSelectedType(type);
    const handleGenderSelect = (gender: 'male' | 'female') => setSelectedGender(gender);
    const isReady = selectedType && selectedGender && selectedMentorType;

    const handleContinue = () => {
        if (isReady) {
            setMessage('');
            setStep('callOptions');
        }
    };

    const handleStartCall = () => {
        localStorage.setItem('userType', selectedType!);
        localStorage.setItem('mentorGender', selectedGender!);
        localStorage.setItem('mentorType', selectedMentorType!);
        navigate('/mentor/call');
    };

    const handleSchedule = () => setStep('schedule');

    const handleConfirmSchedule = () => {
        const input = document.getElementById('scheduleTime') as HTMLInputElement;
        const selectedDate = new Date(input.value);
        if (!selectedDate || selectedDate < new Date()) {
            alert('Select a valid future time.');
            return;
        }
        setMessage('Call Scheduled Successfully!');
        setStep('callOptions');
    };

    return (
        <div className="min-h-screen bg-background relative">

            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-[88px] z-40">
                <Sidebar
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={handleMenuItemClick}
                />
            </div>

            {/* Navbar */}
            <MentorNavbar
                showNav={showNav}
                scrolled={scrolled}
                onMobileMenuOpen={() => setMobileMenu(true)}
            />

            {/* Mobile menu */}
            {mobileMenu && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="fixed inset-0 z-[60] bg-background md:hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="font-semibold text-lg">HHT Mentor</span>
                        <button onClick={() => setMobileMenu(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6">
                        <Button
                            onClick={() => {
                                navigate('/dashboard');
                                setMobileMenu(false);
                            }}
                            className="w-full gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Page Content - Only the Start Session section remains */}
            <div>
                {/* ================= START SESSION SECTION (HERO) ================= */}
                <section className="relative pt-32 md:pt-36 lg:pt-40 pb-24 overflow-hidden bg-gradient-to-br from-[#0080ff]/10 via-white to-white">
                    <div className="container mx-auto px-6 lg:px-12 md:ml-[76px]">

                        {/* ===== Header ===== */}
                        <div className="text-center mb-16 max-w-4xl mx-auto">
    <h1 className="font-bold tracking-tight leading-tight 
        text-3xl sm:text-4xl md:text-5xl lg:text-5xl">

        Start Your{" "}
        <span className="text-[#1a73e8]">
            AI Mentorship
        </span>{" "}
        Session
    </h1>

    <p className="mt-5 text-base md:text-lg text-gray-500 max-w-xl mx-auto">
        Connect with intelligent mentors and get personalized career guidance instantly.
    </p>
</div>

                        {/* ===== Success Message ===== */}
                        {message && (
                            <div className="max-w-2xl mx-auto mb-8">
                                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-center shadow-sm">
                                    <span dangerouslySetInnerHTML={{ __html: message }} />
                                </div>
                            </div>
                        )}

                        <div className="max-w-3xl mx-auto relative">

                            <AnimatePresence mode="wait">

                                {/* ================= STEP 1 ================= */}
                                {step === "profile" && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10"
                                    >

                                        {/* Progress */}
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="text-sm font-medium text-[#0080ff]">
                                                Step 1 of 2
                                            </div>
                                            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "50%" }}
                                                    transition={{ duration: 0.4 }}
                                                    className="h-2 bg-[#0080ff]"
                                                />
                                            </div>
                                        </div>

                                        {/* ================= Mentor Type ================= */}
                                        <div className="mb-10">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                                Select Mentor Type
                                            </h3>

                                            <div className="grid sm:grid-cols-3 gap-6">
                                                {mentorTypes.map((type) => {
                                                    const Icon = type.icon;
                                                    const isSelected = selectedMentorType === type.id;

                                                    return (
                                                        <motion.button
                                                            whileTap={{ scale: 0.97 }}
                                                            animate={{ scale: isSelected ? 1.03 : 1 }}
                                                            key={type.id}
                                                            onClick={() => setSelectedMentorType(type.id)}
                                                            className={`
                        relative flex flex-col items-center justify-center
                        rounded-xl border-2 p-6 transition-all
                        ${isSelected
                                                                    ? "border-[#0080ff] bg-[#0080ff]/5 shadow-md"
                                                                    : "border-gray-200 hover:border-[#0080ff]/40"
                                                                }
                      `}
                                                        >
                                                            {isSelected && (
                                                                <div className="absolute top-3 right-3 bg-[#0080ff] text-white rounded-full p-1">
                                                                    <Check className="w-4 h-4" />
                                                                </div>
                                                            )}

                                                            <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center mb-3
                        ${isSelected
                                                                    ? "bg-[#0080ff] text-white"
                                                                    : "bg-[#0080ff]/10 text-[#0080ff]"}
                      `}>
                                                                <Icon className="w-6 h-6" />
                                                            </div>

                                                            <span className="font-medium text-sm">
                                                                {type.label}
                                                            </span>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* ================= User Type ================= */}
                                        <div className="mb-10">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                                What describes you best?
                                            </h3>

                                            <div className="grid sm:grid-cols-2 gap-5">

                                                {["corporate", "student"].map((value) => {
                                                    const isSelected = selectedType === value;

                                                    return (
                                                        <motion.button
                                                            key={value}
                                                            whileTap={{ scale: 0.97 }}
                                                            animate={{ scale: isSelected ? 1.02 : 1 }}
                                                            onClick={() => handleTypeSelect(value as any)}
                                                            className={`
                        relative rounded-xl border-2 py-4 font-medium transition-all
                        ${isSelected
                                                                    ? "border-[#0080ff] bg-[#0080ff] text-white shadow-md"
                                                                    : "border-gray-200 hover:border-[#0080ff]/40"
                                                                }
                      `}
                                                        >
                                                            {isSelected && (
                                                                <Check className="absolute top-3 right-3 w-4 h-4" />
                                                            )}
                                                            {value === "corporate"
                                                                ? "Corporate Employee"
                                                                : "Student"}
                                                        </motion.button>
                                                    );
                                                })}

                                            </div>
                                        </div>

                                        {/* ================= Gender ================= */}
                                        <div className="mb-12">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                                Select Mentor Gender
                                            </h3>

                                            <div className="grid sm:grid-cols-2 gap-5">
                                                {["male", "female"].map((value) => {
                                                    const isSelected = selectedGender === value;

                                                    return (
                                                        <motion.button
                                                            key={value}
                                                            whileTap={{ scale: 0.97 }}
                                                            animate={{ scale: isSelected ? 1.02 : 1 }}
                                                            onClick={() => handleGenderSelect(value as any)}
                                                            className={`
                        relative rounded-xl border-2 py-4 font-medium transition-all
                        ${isSelected
                                                                    ? "border-[#0080ff] bg-[#0080ff] text-white shadow-md"
                                                                    : "border-gray-200 hover:border-[#0080ff]/40"
                                                                }
                      `}
                                                        >
                                                            {isSelected && (
                                                                <Check className="absolute top-3 right-3 w-4 h-4" />
                                                            )}
                                                            {value === "male" ? "Male Mentor" : "Female Mentor"}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Continue */}
                                        <button
                                            disabled={!isReady}
                                            onClick={handleContinue}
                                            className={`w-full py-4 rounded-xl font-semibold text-white transition-all
                ${isReady
                                                    ? "bg-[#0080ff] hover:bg-[#006edc] shadow-lg"
                                                    : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                        >
                                            Continue
                                        </button>
                                    </motion.div>
                                )}

                                {/* ================= STEP 2 ================= */}
                                {step === "callOptions" && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10"
                                    >

                                        {/* Progress */}
                                        <div className="flex items-center justify-between mb-10">
                                            <button
                                                onClick={() => setStep("profile")}
                                                className="text-sm text-gray-500 hover:text-[#0080ff]"
                                            >
                                                ← Back
                                            </button>

                                            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: "50%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 0.4 }}
                                                    className="h-2 bg-[#0080ff]"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold text-center mb-8">
                                            Choose Call Option
                                        </h3>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={handleStartCall}
                                                className="py-5 rounded-xl bg-[#0080ff] text-white font-semibold shadow-md"
                                            >
                                                Start Call Now
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setStep("schedule")}
                                                className="py-5 rounded-xl border-2 border-[#0080ff] text-[#0080ff] font-semibold"
                                            >
                                                Schedule Call
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ================= SCHEDULE ================= */}
                                {step === "schedule" && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10"
                                    >

                                        <button
                                            onClick={() => setStep("callOptions")}
                                            className="text-sm text-gray-500 hover:text-[#0080ff] mb-6"
                                        >
                                            ← Back
                                        </button>

                                        <h3 className="text-xl font-semibold text-center mb-8">
                                            Schedule Your Call
                                        </h3>

                                        <input
                                            type="datetime-local"
                                            id="scheduleTime"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-4 mb-6 focus:outline-none focus:ring-2 focus:ring-[#0080ff]"
                                        />

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleConfirmSchedule}
                                            className="w-full py-4 rounded-xl bg-[#0080ff] text-white font-semibold shadow-md"
                                        >
                                            Confirm Schedule
                                        </motion.button>
                                    </motion.div>
                                )}

                            </AnimatePresence>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default IndexPage;
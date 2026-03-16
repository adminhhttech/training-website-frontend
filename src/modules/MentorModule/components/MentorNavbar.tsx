import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MentorNavbarProps {
    showNav: boolean;
    scrolled: boolean;
    onMobileMenuOpen: () => void;
}

const MentorNavbar: React.FC<MentorNavbarProps> = ({
    showNav,
    scrolled,
    onMobileMenuOpen,
}) => {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {showNav && (
                <motion.nav
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`fixed top-0 left-0 w-full z-50
                        ${scrolled
                            ? "bg-background/95 backdrop-blur shadow-lg border-b"
                            : "bg-transparent"
                        }`}
                >
                    {/* Gradient bottom glow with #0080ff */}
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none">
                        <div className="h-4 bg-gradient-to-r from-transparent via-[#0080ff]/90 to-transparent blur-2xl" />
                        <div className="h-px bg-gradient-to-r from-transparent via-[#0080ff] to-transparent drop-shadow-[0_0_8px_#0080ff]" />
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                        <div className="flex items-center justify-between">
                            {/* Logo and title */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                onClick={() => navigate("/mentor")}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <img
                                    src="/navbarIcon.png"
                                    alt="HHT Mentor"
                                    className="h-8 w-auto transition-transform duration-200 hover:scale-105"
                                />


                            </motion.div>

                            <div className="flex items-center gap-2">

    {/* Desktop Dashboard Button */}
    <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/dashboard')}
        className="
        hidden sm:flex
        items-center
        gap-2
        px-3 py-2 sm:px-5 sm:py-2.5
        text-xs sm:text-sm
        font-medium
        whitespace-nowrap
        "
    >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="hidden md:inline">Dashboard</span>
    </Button>

    {/* Mobile Menu Button */}
    <button
        onClick={onMobileMenuOpen}
        className="
        sm:hidden
        flex items-center justify-center
        p-2
        rounded-lg
        hover:bg-muted
        transition
        "
        aria-label="Open menu"
    >
        <Menu className="w-5 h-5" />
    </button>

                            </div>
                        </div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default MentorNavbar;
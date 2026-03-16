
import { useEffect, useState } from "react";
// Remove this line, combine with the next import
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Download, Palette, Layout, ArrowLeft, Menu, X } from 'lucide-react';
import { RESUME_TEMPLATES } from './types/resume';
import { ResumeStartModal } from './components/ai/ResumeStartModal';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sidebar } from '@/components/student/Sidebar'; // Adjust path as needed

const features = [
  {
    icon: Layout,
    title: `${RESUME_TEMPLATES.length} Professional Templates`,
    description: 'Choose from professional, modern, creative, executive, minimalist, and more.',
  },
  {
    icon: Palette,
    title: 'Customizable Colors',
    description: 'Personalize your resume with beautiful color schemes that match your style.',
  },
  {
    icon: Download,
    title: 'Export to PDF',
    description: 'Download your polished resume as a high-quality PDF ready for applications.',
  },
  {
    icon: Sparkles,
    title: 'Real-time Preview',
    description: 'See changes instantly as you edit with our live preview feature.',
  },
];

const Home = () => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  // State for Sidebar
  const [activeMenuItem, setActiveMenuItem] = useState("resume-lab");

  // Handle menu item click - Navigate to dashboard with specific view
  const handleMenuItemClick = (id: string) => {
    setActiveMenuItem(id);
    
    switch(id) {
      case "home":
        // Navigate to dashboard without opening any specific component
        navigate("/dashboard");
        break;
      case "forum":
        // Navigate to dashboard and automatically open forum
        navigate("/dashboard", { state: { openComponent: "forum" } });
        break;
      case "resume-lab":
        // Already on resume lab page, just scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case "mock-test":
        // Navigate to dashboard and automatically open practice section
        navigate("/dashboard", { state: { openComponent: "mock-test" } });
        break;
      default:
        break;
    }
  };

  

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchParams.get("openStart") === "true") {
      setShowStartModal(true);
    }
  }, [searchParams]);

  const handleChooseAI = () => {
    setShowStartModal(false);
    navigate('builder?startWithAI=true');
  };

  const handleChooseManual = () => {
    setShowStartModal(false);
    navigate('builder');
  };

  return (
    <div className="min-h-screen bg-background">
      <ResumeStartModal
        open={showStartModal}
        onOpenChange={setShowStartModal}
        onChooseAI={handleChooseAI}
        onChooseManual={handleChooseManual}
      />

      {/* Add Sidebar Component */}
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={handleMenuItemClick}
      />

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-24">
        {/* Background gradient with #0080ff */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0080ff]/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0080ff]/15 via-transparent to-transparent" />

        {/* Navigation */}
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
                <div className="h-px bg-gradient-to-r from-transparent via-[#0080ff] to-transparent
    drop-shadow-[0_0_8px_#0080ff]" />
              </div>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      src="/hht-resume-logo.png"
                      alt="AI Resume Lab Logo"
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-sm object-contain hover:shadow-md transition"
                    />
                    <span className="font-heading font-semibold text-lg sm:text-xl">
                      AI Resume Lab
                    </span>
                  </motion.div>

                  {/* Desktop Back to Home */}
                  <Button
                    asChild
                    className="hidden sm:flex gap-2 px-5 py-2.5 text-sm font-medium bg-[#0080ff] hover:bg-[#0066cc] text-white"
                  >
                    <a
                      href="https://training-website-hht.vercel.app"
                      aria-label="Back to Home"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Home
                    </a>
                  </Button>

                  {/* Mobile Menu Button */}
                  <button
                    aria-label="Open menu"
                    onClick={() => setMobileMenu(true)}
                    className="sm:hidden p-2 rounded-lg hover:bg-muted"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-[60] bg-background"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-heading font-semibold text-lg">
                  AI Resume Lab
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenu(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-[#0080ff] hover:bg-[#0066cc] text-white"
                >
                  <a
                    href="https://training-website-hht.vercel.app"
                    onClick={() => setMobileMenu(false)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content - Add left margin for desktop to accommodate sidebar */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32 md:ml-[76px] md:pl-0">
          <div className="max-w-4xl mx-auto text-center pt-4">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              Build Your Perfect{" "}
              <span className="text-[#0080ff] font-bold">Resume</span>{" "}
              in Minutes
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Create a professional, ATS-friendly resume with our easy-to-use builder.
              Choose from stunning templates and customize every detail.
            </p>
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => setShowStartModal(true)}
                className="w-full sm:w-auto gap-2 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#0080ff] hover:bg-[#0066cc] text-white"
              >
                <Sparkles className="w-5 h-5" />
                Create Your Resume
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span></span>
              </div>
            </div>
          </div>

          {/* Preview Image Placeholder */}
          <div className="mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto px-4">
            <div className="relative">
              {/* Preview gradient with #0080ff */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0080ff]/20 via-[#0080ff]/10 to-[#0080ff]/20 rounded-2xl blur-2xl opacity-50" />
              <div className="relative bg-card rounded-xl sm:rounded-2xl border shadow-2xl overflow-hidden">
                <div className="bg-[#0080ff]/10 p-3 sm:p-4 flex items-center gap-2">
                  <div className="flex gap-1.5 sm:gap-2">
                    {/* Improved standard browser-like colors */}
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground ml-2 sm:ml-4">Resume Builder Preview</span>
                </div>
                <div className="p-4 sm:p-6 md:p-8 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Editor Preview */}
                    <div className="bg-card rounded-lg border p-3 sm:p-4 space-y-3 sm:space-y-4">
                      <div className="h-3 sm:h-4 bg-muted rounded w-1/2" />
                      <div className="space-y-2">
                        <div className="h-2 sm:h-3 bg-muted rounded w-full" />
                        <div className="h-2 sm:h-3 bg-muted rounded w-3/4" />
                        <div className="h-2 sm:h-3 bg-muted rounded w-5/6" />
                      </div>
                      <div className="pt-2 sm:pt-3 border-t space-y-2">
                        <div className="h-2 sm:h-3 bg-[#0080ff]/30 rounded w-2/3" />
                        <div className="h-2 sm:h-3 bg-muted rounded w-full" />
                      </div>
                    </div>
                    {/* Resume Preview */}
                    <div className="bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
                      <div className="border-b pb-2 sm:pb-3 mb-2 sm:mb-3">
                        <div className="h-4 sm:h-5 bg-[#0080ff]/20 rounded w-1/2 mb-1.5 sm:mb-2" />
                        <div className="h-2 bg-muted rounded w-1/3" />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="h-2 sm:h-3 bg-[#0080ff]/20 rounded w-1/4" />
                        <div className="h-1.5 sm:h-2 bg-muted rounded w-full" />
                        <div className="h-1.5 sm:h-2 bg-muted rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section - Add left margin for desktop */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30 md:ml-[76px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need to Build a Great Resume
            </h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Our AI Resume Builder comes packed with features to help you create a standout resume.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card rounded-xl border p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Feature icon with #0080ff */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#0080ff]/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#0080ff]/20 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0080ff]" />
                </div>
                <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Add left margin for desktop */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 md:ml-[76px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Ready to Land Your Dream Job?
            </h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base md:text-lg">
              Start building your professional resume today. It only takes a few minutes.
            </p>
            <Button
              size="lg"
              onClick={() => setShowStartModal(true)}
              className="mt-8 sm:mt-10 lg:mt-12 w-full sm:w-auto gap-2 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#0080ff] hover:bg-[#0066cc] text-white"

            >
              <FileText className="w-5 h-5" />
              Start Building Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Add left margin for desktop */}
      <footer className="border-t bg-card py-6 sm:py-8 md:ml-[76px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-heading font-medium text-foreground">AI Resume Lab</span>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} AI Resume Lab. Build your future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
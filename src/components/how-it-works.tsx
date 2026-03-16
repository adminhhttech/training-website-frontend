"use client"

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
                    <p className="text-lg text-gray-600 mt-2">Your path to success in just a few simple steps</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            title: "Browse & Discover",
                            description:
                                "Explore our extensive catalog of courses across multiple disciplines and find the perfect match for your goals.",
                            image: "/howitworks-1.webp",
                            alt: "Browse icon",
                        },
                        {
                            title: "Enroll & Start",
                            description:
                                "Secure your spot with easy enrollment and begin learning immediately with instant access to materials.",
                            image: "/howitworks-4.webp",
                            alt: "Enroll icon",
                        },
                        {
                            title: "Learn & Practice",
                            description:
                                "Engage with interactive content, complete hands-on projects, and receive feedback from expert instructors.",
                            image: "/howitworks-3.webp",
                            alt: "Learn icon",
                        },
                        {
                            title: "Graduate & Succeed",
                            description:
                                "Complete your course, earn your certification, and leverage your new skills for career advancement.",
                            image: "/howitworks-2.webp",
                            alt: "Graduate icon",
                        },
                    ].map((card, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Top Image with Zoom Effect */}
                            <div className="overflow-hidden rounded-t-2xl">
                                <img
                                    src={card.image || "/placeholder.svg"}
                                    alt={card.alt}
                                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-gray-600 text-sm">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection

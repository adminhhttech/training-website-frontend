import { Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <img
              src="/logo_white.png"
              alt="Logo"
              className="w-20 h-20 object-contain mb-2"
            />
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Empowering learners worldwide with high-quality, accessible online education. Transform your career with
              our expert-led courses.
            </p>
            <div className="flex space-x-5 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["About Us", "Our Story", "Careers", "Press", "Blog", "Partnerships"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Support</h4>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Contact Support",
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy",
                "Accessibility",
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                hr@hhttech.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 8767937077
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  Nagpur, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            <p className="text-gray-400 text-sm">&copy; 2025 HHT Learning. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy", "Terms", "Cookies"].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

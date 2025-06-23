import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-beach-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-ocean-500 rounded-full" />
              </div>
              <span className="font-bold text-xl text-white">Beach Box</span>
            </div>
            <p className="text-sm">
              Revenue-generating sunscreen vending solutions for hotels, resorts, and recreational venues across Florida.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-beach-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="hover:text-beach-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="hover:text-beach-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Partnership Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Partnership</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/partnership-models" className="hover:text-beach-400 transition-colors">
                  Partnership Models
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-beach-400 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/why-beach-box" className="hover:text-beach-400 transition-colors">
                  Why Beach Box
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-beach-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-beach-400 transition-colors">
                  Partnership Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-beach-400 transition-colors">
                  Venue FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-beach-400 transition-colors">
                  Revenue Calculator
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-beach-400 transition-colors">
                  Partner Support
                </a>
              </li>
            </ul>
          </div>

          {/* Partnership Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Partnership Team</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-beach-400" />
                <a href="mailto:partnerships@beachboxflorida.com" className="hover:text-beach-400 transition-colors">
                  partnerships@beachboxflorida.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-beach-400" />
                <a href="tel:1-800-SUNSCREEN" className="hover:text-beach-400 transition-colors">
                  1-800-SUNSCREEN
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-beach-400 mt-1" />
                <span className="text-sm">
                  123 Beach Blvd<br />
                  Miami Beach, FL 33139<br />
                  <span className="text-xs">Headquarters & Demo Center</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © 2024 Beach Box Florida. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-beach-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-beach-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-beach-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
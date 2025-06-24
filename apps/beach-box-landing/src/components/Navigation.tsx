import { Link } from '@tanstack/react-router'
import { Button } from '@beach-box/unify-ui'
import { Menu, X, Sun } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Partnership Models', href: '/partnership-models' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Why Beach Box', href: '/why-beach-box' },
    { label: 'About', href: '/about' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link className="flex items-center space-x-2" to="/">
            <div className="w-8 h-8 bg-beach-500 rounded-full flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Beach Box</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                to={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/signin"
              className="px-4 py-2 bg-beach-500 text-white rounded hover:bg-beach-600 transition-colors font-semibold"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden",
          isOpen ? "block" : "hidden"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                to={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link className="block" search={{ subject: undefined, model: undefined }} to="/contact">
                <Button className="w-full" variant="outline">
                  Schedule Consult
                </Button>
              </Link>
              <Link className="block" search={{ subject: undefined, model: undefined }} to="/contact">
                <Button className="w-full">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
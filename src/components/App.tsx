import { MotionConfig } from 'framer-motion'
import NavBar from './NavBar'
import Hero from './Hero'
import TrustStrip from './TrustStrip'
import ServicesSection from './ServicesSection'
import AdvancedAccordion from './AdvancedAccordion'
import FAQSection from './FAQSection'
import BookingSection from './BookingSection'
import ContactSection from './ContactSection'
import Footer from './Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <NavBar />
        <main id="main" className="relative">
          <Hero />
          <TrustStrip />
          <ServicesSection />
          <AdvancedAccordion />
          <FAQSection />
          <BookingSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}

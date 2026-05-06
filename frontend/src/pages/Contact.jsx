import HeroSection from '../components/HeroSection';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <>
      <HeroSection
        eyebrow="Contact"
        title="Get in touch"
        copy="Tell us your solar requirement and the team will respond with the right next step, whether it is a residential rooftop or a large EPC project."
        image="/contact.jpg"
        priority
      />
      <ContactForm />
    </>
  );
}

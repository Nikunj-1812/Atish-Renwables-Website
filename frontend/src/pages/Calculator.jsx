import HeroSection from '../components/HeroSection';
import Calculator from '../components/Calculator';

export default function CalculatorPage() {
  return (
    <>
      <HeroSection
        eyebrow="Savings"
        title="Solar savings calculator"
        copy="Estimate system size, cost, savings, and payback period before you request a site survey."
        image="/calculator.jpg"
        priority
      />
      <Calculator />
    </>
  );
}

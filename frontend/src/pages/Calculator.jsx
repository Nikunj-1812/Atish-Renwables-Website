import HeroSection from '../components/HeroSection';
import Calculator from '../components/Calculator';
import CalculatorImg from '../assets/Calculator.png';

export default function CalculatorPage() {
  return (
    <>
      <HeroSection
        eyebrow="Savings"
        title="Solar savings calculator"
        copy="Estimate system size, cost, savings, and payback period before you request a site survey."
        image={CalculatorImg}
        isHomePage={false}
        priority
      />
      <Calculator />
    </>
  );
}

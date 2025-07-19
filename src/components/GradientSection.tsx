import { BackgroundGradientAnimation } from "./BackgroundGradientAnimation";

const GradientSection = () => {
  return (
    <section className="relative h-80 w-full overflow-hidden">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(108, 0, 162)"
        gradientBackgroundEnd="rgb(0, 17, 82)"
        firstColor="147, 51, 234"
        secondColor="221, 74, 255"
        thirdColor="168, 85, 247"
        fourthColor="192, 132, 252"
        fifthColor="196, 181, 253"
        pointerColor="147, 51, 234"
        containerClassName="h-80"
      >
        <div className="relative z-50 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Studies?
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of students who've organized their way to success
            </p>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </section>
  );
};

export default GradientSection;
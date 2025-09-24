import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const handleOrderNow = () => {
    window.open("https://wa.me/573142621490?text=¡Hola! Quiero pedir Rellenitas 😊", "_blank");
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold text-white mb-6 leading-tight">
          El gimnasio puede esperar…<br />
          <span className="text-primary">las rellenitas no.</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 font-lato max-w-2xl mx-auto">
          Galletas artesanales con rellenos que enamoran. Hechas con amor en Valledupar.
        </p>
        
        <Button 
          onClick={handleOrderNow}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          ¡Pedir Ahora!
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
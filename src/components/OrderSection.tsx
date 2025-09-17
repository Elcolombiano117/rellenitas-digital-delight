import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";

const OrderSection = () => {
  const handleWhatsAppOrder = () => {
    window.open("https://wa.me/573001234567?text=¡Hola! Quiero pedir Rellenitas 😊", "_blank");
  };

  const handleCallOrder = () => {
    window.open("tel:+573001234567", "_self");
  };

  return (
    <section id="pedidos" className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold text-foreground mb-4">
            ¡Haz tu <span className="text-primary">pedido</span> ahora!
          </h2>
          <p className="text-lg text-muted-foreground font-lato max-w-2xl mx-auto">
            Es muy fácil. Solo escríbenos por WhatsApp y te ayudaremos con todo
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {/* WhatsApp Button - Primary */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleWhatsAppOrder}
              size="lg"
              className="btn-whatsapp text-white font-semibold px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              📱 ¡Habla con nosotros por WhatsApp!
            </Button>
          </div>
          
          {/* Alternative - Call Button */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground font-lato mb-4">¿Prefieres llamar?</p>
            <Button 
              onClick={handleCallOrder}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg rounded-xl w-full sm:w-auto"
            >
              <Phone className="w-5 h-5 mr-2" />
              Llamar ahora
            </Button>
          </div>
          
          {/* Process Steps */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 mt-12">
            <h3 className="text-2xl font-poppins font-bold text-foreground text-center mb-6">
              ¿Cómo funciona?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-3">
                  1
                </div>
                <h4 className="font-poppins font-semibold text-foreground mb-2">Escríbenos</h4>
                <p className="text-muted-foreground font-lato text-sm">
                  Dinos qué Rellenitas quieres y cuántas
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-3">
                  2
                </div>
                <h4 className="font-poppins font-semibold text-foreground mb-2">Confirmamos</h4>
                <p className="text-muted-foreground font-lato text-sm">
                  Te confirmamos el pedido y el tiempo de entrega
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-3">
                  3
                </div>
                <h4 className="font-poppins font-semibold text-foreground mb-2">¡Disfruta!</h4>
                <p className="text-muted-foreground font-lato text-sm">
                  Recibe tus Rellenitas frescas y deliciosas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
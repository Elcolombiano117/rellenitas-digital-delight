import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OrderSection = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleWhatsAppOrder = () => {
    // Generate a unique order ID for tracking
    const orderId = `REL${Date.now().toString().slice(-6)}`;
    
    // For demo purposes, we'll open tracking after a short delay
    setTimeout(() => {
      window.open(`/seguimiento/${orderId}`, "_blank");
    }, 2000);
    
    window.open("https://wa.me/573142621490?text=¡Hola! Quiero pedir Rellenitas 😊", "_blank");
  };

  const handleCallOrder = () => {
    window.open("tel:+573142621490", "_self");
  };

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Número requerido",
        description: "Por favor ingresa tu número de pedido",
        variant: "destructive"
      });
      return;
    }

    try {
      // Verificar si el pedido existe
      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", trackingNumber.trim())
        .single();

      if (error || !data) {
        toast({
          title: "Pedido no encontrado",
          description: "No se encontró un pedido con ese número. Verifica e intenta nuevamente.",
          variant: "destructive"
        });
        return;
      }

      // Navegar a la página de tracking
      navigate(`/seguimiento/${data.id}`);
    } catch (error) {
      console.error("Error tracking order:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al buscar tu pedido. Intenta nuevamente.",
        variant: "destructive"
      });
    }
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

          {/* Track Your Order Section */}
          <div className="bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl p-8 mt-8">
            <h3 className="text-2xl font-poppins font-bold text-foreground text-center mb-4">
              🔍 ¿Ya hiciste tu pedido?
            </h3>
            <p className="text-muted-foreground font-lato text-center mb-6">
              Consulta el estado de tu pedido en tiempo real
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Ej: REL001"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                className="flex-1 text-lg py-6"
              />
              <Button 
                onClick={handleTrackOrder}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Rastrear
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-lato text-center mt-4">
              Ingresa el número de pedido que te enviamos por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
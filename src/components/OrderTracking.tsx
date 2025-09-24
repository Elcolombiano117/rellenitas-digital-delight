import { useState, useEffect } from "react";
import { CheckCircle, Package, Truck, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OrderTrackingProps {
  orderId: string;
  customerName?: string;
  dedicatoria?: string;
}

const OrderTracking = ({ orderId, customerName = "amigo", dedicatoria }: OrderTrackingProps) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  const stages = [
    {
      id: 1,
      title: "NACIMIENTO",
      subtitle: "¡TU RELLENITA SE ESTÁ HACIENDO!",
      icon: Heart,
      description: "Tu Rellenita está naciendo. Cada capa se hace con amor, no con máquinas. Estamos en el paso 1 de 4.",
      color: "from-primary to-primary-glow",
      animation: "animate-pulse"
    },
    {
      id: 2,
      title: "EMPAQUE CON ALMA",
      subtitle: "¡SE LO DEDICAN!",
      icon: Package,
      description: `Tu Rellenita ya está lista. ¡Y la estamos empacando con una dedicatoria especial! ${dedicatoria || `¿Sabes qué dice? 'Para ti, después de un día largo.'`}`,
      color: "from-chocolate to-chocolate-light",
      animation: "animate-bounce"
    },
    {
      id: 3,
      title: "EN CAMINO",
      subtitle: "¡EL REPARTIDOR VA POR TI!",
      icon: Truck,
      description: "Juanito lleva tu Rellenita hacia ti. Ya pasó por la calle 10… ¡está a solo 3 cuadras!",
      color: "from-morado to-morado-light",
      animation: "animate-pulse"
    },
    {
      id: 4,
      title: "¡LLEGÓ TU MOMENTO DULCE!",
      subtitle: "¡FELICIDADES!",
      icon: CheckCircle,
      description: "¡Felicidades! Tu Rellenita llegó. Disfrútala… o compártela. Pero no la guardes para mañana.",
      color: "from-primary to-secondary",
      animation: "animate-bounce"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 5000); // Change stage every 5 seconds for demo

    return () => clearInterval(timer);
  }, []);

  const currentStageData = stages[currentStage - 1];

  const handleShare = () => {
    const text = `Mi Rellenita llegó… y me hizo feliz. 🍫 #RellenitasValledupar #DulceDeCasa`;
    const url = `https://www.instagram.com/create/story/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const MapAnimation = () => (
    <div className="relative w-full h-40 bg-gradient-to-br from-beige to-white rounded-2xl p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-xs text-chocolate font-lato">Universidad del Cesar</div>
          <div className="text-xs text-chocolate font-lato">Parque de la Cultura</div>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <div className="relative">
            <div className="w-6 h-6 bg-primary rounded-full animate-pulse flex items-center justify-center">
              <Truck className="w-3 h-3 text-white" />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-chocolate text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Juanito, el Dulce Repartidor
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-xs text-chocolate/60 font-lato">Tu destino</div>
          <MapPin className="w-4 h-4 text-morado mx-auto mt-1" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-white to-beige/50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-chocolate mb-2">
            El Camino de tu <span className="text-primary">Rellenita</span>
          </h1>
          <p className="text-chocolate/70 font-lato">
            Pedido #{orderId} • Para {customerName}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  index + 1 <= currentStage 
                    ? 'bg-primary text-white' 
                    : 'bg-chocolate/20 text-chocolate/50'
                }`}>
                  <stage.icon className="w-4 h-4" />
                </div>
                <div className="text-xs text-chocolate/60 font-lato mt-1 text-center max-w-16">
                  {stage.title}
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-chocolate/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-1000 ease-out"
              style={{ width: `${(currentStage / stages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Stage */}
        <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentStageData.color} mx-auto mb-6 flex items-center justify-center ${currentStageData.animation}`}>
            <currentStageData.icon className="w-8 h-8 text-white" />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-poppins font-bold text-chocolate mb-2">
              {currentStageData.title}
            </h2>
            <h3 className="text-lg font-poppins font-semibold text-primary mb-4">
              {currentStageData.subtitle}
            </h3>
            <p className="text-chocolate/80 font-lato leading-relaxed mb-6">
              {currentStageData.description}
            </p>

            {/* Special interactions per stage */}
            {currentStage === 1 && (
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                ¿Quieres que incluyamos una nota personal?
              </Button>
            )}

            {currentStage === 3 && (
              <div className="mt-6">
                <MapAnimation />
              </div>
            )}

            {currentStage === 4 && (
              <div className="space-y-4">
                <div className="text-6xl animate-bounce">🍫</div>
                <Button 
                  onClick={() => setShowShareModal(true)}
                  className="bg-gradient-to-r from-primary to-primary-glow text-white font-semibold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  ¡Comparte tu momento! 📸
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-8 max-w-md w-full bg-white">
              <div className="text-center">
                <h3 className="text-xl font-poppins font-bold text-chocolate mb-4">
                  ¡Comparte tu momento dulce!
                </h3>
                <p className="text-chocolate/70 font-lato mb-6">
                  Tu historia en Instagram con una plantilla lista
                </p>
                <div className="space-y-4">
                  <Button 
                    onClick={handleShare}
                    className="w-full bg-gradient-to-r from-[#E4405F] to-[#F77737] text-white font-semibold py-3 rounded-xl"
                  >
                    Abrir Instagram Stories
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowShareModal(false)}
                    className="w-full"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Audio Section */}
        <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <div className="text-center">
            <h3 className="text-lg font-poppins font-semibold text-chocolate mb-4">
              🎵 Escucha nuestro comercial
            </h3>
            <audio controls className="w-full">
              <source src="/src/assets/galletas-del-alma.mp3" type="audio/mpeg" />
              Tu navegador no soporta audio HTML5.
            </audio>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;
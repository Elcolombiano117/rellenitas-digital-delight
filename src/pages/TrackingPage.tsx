import { useParams } from "react-router-dom";
import OrderTracking from "@/components/OrderTracking";
import Header from "@/components/Header";

const TrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige via-white to-beige/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-poppins font-bold text-chocolate mb-4">
            Pedido no encontrado
          </h1>
          <p className="text-chocolate/70 font-lato">
            El número de pedido no es válido
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <OrderTracking 
        orderId={orderId} 
        customerName="Amigo dulce"
        dedicatoria="Para ti, después de un día largo ❤️"
      />
    </div>
  );
};

export default TrackingPage;
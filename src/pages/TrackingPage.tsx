import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, CreditCard, Package, CheckCircle, Clock } from "lucide-react";

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500", step: 1 },
  confirmed: { label: "Confirmado", color: "bg-blue-500", step: 2 },
  preparing: { label: "Preparando", color: "bg-purple-500", step: 3 },
  ready: { label: "Listo", color: "bg-green-500", step: 4 },
  in_delivery: { label: "En camino", color: "bg-indigo-500", step: 5 },
  delivered: { label: "Entregado", color: "bg-green-600", step: 6 },
  cancelled: { label: "Cancelado", color: "bg-red-500", step: 0 },
};

const TrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      
      // Real-time updates
      const channel = supabase
        .channel(`order-${orderId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`
          },
          () => {
            fetchOrder();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch status history
      const { data: historyData, error: historyError } = await supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

      if (historyError) throw historyError;
      setHistory(historyData || []);

    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg text-muted-foreground">Pedido no encontrado</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentStep = statusConfig[order.order_status as keyof typeof statusConfig]?.step || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-poppins font-bold mb-2">Seguimiento de Pedido</h1>
        <p className="text-muted-foreground mb-8">Pedido #{order.order_number}</p>

        {/* Status Badge */}
        <div className="mb-8">
          <Badge className={`${statusConfig[order.order_status as keyof typeof statusConfig].color} text-white text-lg px-4 py-2`}>
            {statusConfig[order.order_status as keyof typeof statusConfig].label}
          </Badge>
        </div>

        {/* Progress Steps */}
        {order.order_status !== "cancelled" && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                {[
                  { step: 1, label: "Pendiente", icon: Clock },
                  { step: 2, label: "Confirmado", icon: CheckCircle },
                  { step: 3, label: "Preparando", icon: Package },
                  { step: 4, label: "Listo", icon: CheckCircle },
                  { step: 5, label: "En camino", icon: Package },
                  { step: 6, label: "Entregado", icon: CheckCircle },
                ].map(({ step, label, icon: Icon }) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        currentStep >= step ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className={`text-xs text-center ${currentStep >= step ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">{order.customer_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p>{order.customer_phone}</p>
              </div>
              {order.customer_email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <p>{order.customer_email}</p>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p>{order.delivery_address}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_city}, {order.delivery_department}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="capitalize">{order.payment_method}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalle del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {order.order_items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center border-b border-border pb-2 last:border-0">
                    <div>
                      <p className="font-semibold">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento:</span>
                    <span>-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historial del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 h-full bg-border"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold">
                      {statusConfig[entry.status as keyof typeof statusConfig]?.label || entry.status}
                    </p>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TrackingPage;

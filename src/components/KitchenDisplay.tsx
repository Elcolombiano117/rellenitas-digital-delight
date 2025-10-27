import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  product_name: string;
  quantity: number;
  product_price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  order_status: string;
  created_at: string;
  notes?: string;
  order_items: OrderItem[];
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-500", icon: CheckCircle },
  preparing: { label: "Preparando", color: "bg-purple-500", icon: Package },
};

export const KitchenDisplay = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();

    // Real-time updates
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
          // Play notification sound for new orders
          playNotificationSound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .in('order_status', ['pending', 'confirmed', 'preparing'])
        .order("created_at", { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const playNotificationSound = () => {
    // Simple beep notification
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: newStatus,
        notes: `Estado actualizado desde cocina`,
      });

      toast({
        title: "Estado actualizado",
        description: `Pedido marcado como ${statusConfig[newStatus as keyof typeof statusConfig]?.label || newStatus}`,
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: string) => {
    const orderDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - orderDate.getTime()) / 60000);
    
    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} min`;
    }
    
    return orderDate.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-poppins font-bold text-foreground mb-2">
          Pantalla de Cocina
        </h1>
        <p className="text-lg text-muted-foreground">
          {orders.length} {orders.length === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <p className="text-2xl font-semibold text-foreground">
              ¡Todo listo! No hay pedidos pendientes
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.order_status as keyof typeof statusConfig]?.icon || Clock;
            const statusColor = statusConfig[order.order_status as keyof typeof statusConfig]?.color || "bg-gray-500";
            
            return (
              <Card key={order.id} className="p-6 border-2 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-1">
                      #{order.order_number}
                    </h2>
                    <p className="text-lg font-semibold text-foreground">
                      {order.customer_name}
                    </p>
                  </div>
                  <Badge className={`${statusColor} text-white px-3 py-1 text-sm`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {statusConfig[order.order_status as keyof typeof statusConfig]?.label || order.order_status}
                  </Badge>
                </div>

                <div className="mb-4 space-y-2">
                  {order.order_items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                      <span className="text-lg font-medium text-foreground">
                        {item.product_name}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Nota del cliente:
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {formatTime(order.created_at)}
                  </span>
                </div>

                <div className="flex gap-2">
                  {order.order_status === 'pending' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="flex-1"
                      variant="default"
                    >
                      Confirmar
                    </Button>
                  )}
                  {order.order_status === 'confirmed' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex-1"
                      variant="default"
                    >
                      Preparando
                    </Button>
                  )}
                  {order.order_status === 'preparing' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1"
                      variant="default"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Listo
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

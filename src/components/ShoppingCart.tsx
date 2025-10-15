import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2 } from "lucide-react";

interface ShoppingCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShoppingCart = ({ open, onOpenChange }: ShoppingCartProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    let message = "¡Hola! Quiero pedir Rellenitas\nMi pedido:\n\n";
    
    items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      message += `- ${item.name} x${item.quantity} → ${formatPrice(itemTotal)}\n`;
    });
    
    message += `\nTotal: ${formatPrice(getTotalPrice())}\n`;
    message += `\nDirección: [Escribe tu dirección aquí]`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/573142621490?text=${encodedMessage}`, "_blank");
    
    clearCart();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-poppins text-foreground">
            🛒 Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-card border border-border rounded-lg p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-poppins font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold mb-2">
                        {formatPrice(item.price)}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-primary text-primary hover:bg-primary hover:text-white"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-primary text-primary hover:bg-primary hover:text-white"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-poppins font-semibold text-foreground">
                    Total:
                  </span>
                  <span className="text-2xl font-poppins font-bold text-primary">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                <Button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-lg font-semibold rounded-xl"
                  size="lg"
                >
                  📱 Enviar pedido por WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;

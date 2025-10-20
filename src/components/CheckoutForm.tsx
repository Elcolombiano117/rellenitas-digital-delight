import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CartItem } from "@/hooks/useCart";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre completo es obligatorio").max(100),
  address: z.string().trim().min(1, "La dirección es obligatoria").max(200),
  city: z.string().trim().min(1, "La ciudad es obligatoria").max(100),
  department: z.string().trim().min(1, "El departamento es obligatorio").max(100),
  phone: z.string().trim().min(7, "El número de teléfono debe tener al menos 7 dígitos").max(15),
  paymentMethod: z.enum(["efectivo", "transferencia"], {
    required_error: "Debes seleccionar un método de pago",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  items: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onConfirm: (data: CheckoutFormData) => void;
}

const CheckoutForm = ({ items, totalPrice, onBack, onConfirm }: CheckoutFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      city: "Valledupar",
      department: "Cesar",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const onSubmit = (data: CheckoutFormData) => {
    toast({
      title: "¡Pedido confirmado!",
      description: "Tu pedido se enviará por WhatsApp",
      duration: 3000,
    });
    onConfirm(data);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-poppins font-bold text-foreground">
          Confirmar pedido
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* Resumen del pedido */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-poppins font-semibold text-foreground mb-3">
            Resumen del pedido
          </h3>
          <div className="space-y-2 mb-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-semibold text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-2 flex justify-between items-center">
            <span className="font-poppins font-bold text-foreground">Total:</span>
            <span className="text-xl font-poppins font-bold text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Formulario de datos */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-foreground">
              Nombre completo *
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              className="mt-1.5"
              placeholder="Ej: Juan Pérez"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address" className="text-foreground">
              Dirección de entrega *
            </Label>
            <Input
              id="address"
              {...register("address")}
              className="mt-1.5"
              placeholder="Ej: Calle 15 #10-20, Barrio Centro"
            />
            {errors.address && (
              <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city" className="text-foreground">
                Ciudad *
              </Label>
              <Input
                id="city"
                {...register("city")}
                className="mt-1.5"
                placeholder="Ej: Valledupar"
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="department" className="text-foreground">
                Departamento *
              </Label>
              <Input
                id="department"
                {...register("department")}
                className="mt-1.5"
                placeholder="Ej: Cesar"
              />
              {errors.department && (
                <p className="text-sm text-destructive mt-1">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-foreground">
              Número de teléfono *
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              className="mt-1.5"
              placeholder="Ej: 3001234567"
              type="tel"
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label className="text-foreground mb-3 block">
              Método de pago *
            </Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setValue("paymentMethod", value as "efectivo" | "transferencia")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="efectivo" id="efectivo" />
                <Label htmlFor="efectivo" className="cursor-pointer flex-1 text-foreground">
                  💵 Efectivo
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="transferencia" id="transferencia" />
                <Label htmlFor="transferencia" className="cursor-pointer flex-1 text-foreground">
                  💳 Transferencia bancaria
                </Label>
              </div>
            </RadioGroup>
            {errors.paymentMethod && (
              <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="sticky bottom-0 bg-background pt-4 space-y-3 pb-2">
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-lg font-semibold rounded-xl"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Confirmar pedido
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full h-11"
            size="lg"
          >
            Volver al carrito
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;

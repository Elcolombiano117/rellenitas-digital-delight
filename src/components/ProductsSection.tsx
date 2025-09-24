import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import rellenitaOreo from "@/assets/rellenita-oreo.png";
import rellenitaManjar from "@/assets/rellenita-manjar.png";
import rellenitaMM from "@/assets/rellenita-mm.png";
import rellenitaSorpresa from "@/assets/rellenita-sorpresa.png";

const ProductsSection = () => {
  const products = [
    {
      name: "Rellenita Oreo",
      price: "$3.500",
      image: rellenitaOreo,
      description: "Galleta artesanal con relleno cremoso de Oreo"
    },
    {
      name: "Rellenita Manjar",
      price: "$3.800",
      image: rellenitaManjar,
      description: "Deliciosa galleta con manjar blanco derretido"
    },
    {
      name: "Rellenita M&M's",
      price: "$4.200",
      image: rellenitaMM,
      description: "Explosión de colores y sabores con M&M's"
    },
    {
      name: "Rellenita Sorpresa",
      price: "$4.000",
      image: rellenitaSorpresa,
      description: "Sorpresa dulce con mermelada de frutos rojos"
    }
  ];

  const handleAddToOrder = (productName: string) => {
    const message = `¡Hola! Quiero pedir ${productName} 😊`;
    window.open(`https://wa.me/573142621490?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleViewAll = () => {
    window.open("https://wa.me/573142621490?text=¡Hola! Quiero ver todos los sabores disponibles 😊", "_blank");
  };

  return (
    <section id="productos" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold text-foreground mb-4">
            Nuestros sabores más <span className="text-primary">amados</span>
          </h2>
          <p className="text-lg text-muted-foreground font-lato max-w-2xl mx-auto">
            Cada una hecha con ingredientes premium y mucho amor
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <Card key={index} className="card-hover border-0 bg-card overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="font-poppins font-semibold text-xl mb-2 text-foreground">
                  {product.name}
                </h3>
                <p className="text-muted-foreground font-lato mb-3">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-primary mb-4">
                  {product.price}
                </div>
                <Button 
                  onClick={() => handleAddToOrder(product.name)}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300"
                >
                  Añadir al pedido
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={handleViewAll}
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-xl"
          >
            Ver todos los sabores →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
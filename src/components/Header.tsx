import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import ShoppingCartPanel from "@/components/ShoppingCart";
import QuickOrderDialog from "@/components/QuickOrderDialog";
import logo from "@/assets/new-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const navigation = [
    { name: "Inicio", href: "#inicio" },
    { name: "Productos", href: "#productos" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Pedidos", href: "#pedidos" },
    { name: "Contacto", href: "#contacto" },
  ];

  const handleWhatsApp = () => {
    setIsQuickOrderOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img src={logo} alt="Rellenitas" className="h-10 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6 text-primary" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile menu button and cart */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6 text-primary" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* WhatsApp floating button */}
      <Button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-50 btn-whatsapp rounded-full shadow-lg px-4 py-3 h-auto"
        size="lg"
      >
        <span className="text-xl mr-2">📱</span>
        <span className="hidden sm:inline">¡Habla con nosotros!</span>
        <span className="sm:hidden">WhatsApp</span>
      </Button>

      {/* Shopping Cart Panel */}
      <ShoppingCartPanel open={isCartOpen} onOpenChange={setIsCartOpen} />
      
      {/* Quick Order Dialog */}
      <QuickOrderDialog 
        open={isQuickOrderOpen} 
        onOpenChange={setIsQuickOrderOpen}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </>
  );
};

export default Header;
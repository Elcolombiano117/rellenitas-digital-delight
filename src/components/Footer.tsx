import { Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform: string) => {
    const urls = {
      instagram: "https://instagram.com/rellenitas.valledupar",
      whatsapp: "https://wa.me/573001234567?text=¡Hola! Quiero más información sobre Rellenitas 😊"
    };
    window.open(urls[platform as keyof typeof urls], "_blank");
  };

  return (
    <footer className="bg-chocolate text-white">
      {/* Video Section - Proceso Artesanal */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-poppins font-bold mb-4">
              ¿Cómo las <span className="text-primary">hacemos</span>?
            </h3>
            <p className="text-white/80 font-lato max-w-2xl mx-auto">
              Descubre nuestro proceso artesanal donde cada Rellenita se hace con amor y dedicación
            </p>
          </div>
          
          {/* Placeholder for video - Can be replaced with actual video */}
          <div className="max-w-2xl mx-auto">
            <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white/80 font-lato">
                  Video del proceso artesanal<br />
                  <span className="text-sm">(Próximamente)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src={logo} alt="Rellenitas" className="h-12 w-auto mr-3" />
              <span className="text-2xl font-poppins font-bold text-white">Rellenitas</span>
            </div>
            <p className="text-white/80 font-lato mb-6 max-w-md">
              Galletas artesanales con rellenos irresistibles, hechas con amor en Valledupar. 
              Porque no vendemos galletas... vendemos momentos dulces.
            </p>
            <p className="text-white/60 font-lato text-sm">
              📍 Cra. 6 #13C-14, Valledupar, Cesar<br />
              ✉️ hola@rellenitas.com.co<br />
              🌐 www.rellenitas.com.co
            </p>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSocialClick('instagram')}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-colors duration-300 flex items-center justify-center"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('whatsapp')}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] transition-colors duration-300 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white/60">
            <p className="font-lato">
              © {currentYear} Rellenitas. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Política de privacidad
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Términos de compra
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
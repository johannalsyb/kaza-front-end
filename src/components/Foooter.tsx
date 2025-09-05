// import { Link } from "react-router-dom";
import { Instagram, Linkedin, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "../contexts/TranslationContext";
const Footer = () => {
  const { t, language, setLanguage } = useTranslation();
  const currentYear = new Date().getFullYear();
  const socialLinks = [{
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/kazaswap.app/",
    label: t('followUsOnInstagram')
  }, {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/company/kazaswap",
    label: t('connectWithUsOnLinkedIn')
  }];
  const productLinks = [
    {
      name: t('howItWorks'),
      href: "/how-it-works"
    },
    {
      name: t('rewardProgram'),
      href: "/reward-program"
    },
    {
      name: t('faqs'),
      href: "/faq"
    },
    {
      name: t('blog'),
      href: "/blog"
    }
  ];

  const companyLinks = [
    {
      name: t('about'),
      href: "/about"
    },
    {
      name: t('press'),
      href: "/press"
    },
    {
      name: t('contactSupport'),
      href: "/contact"
    }
  ];
  const legalLinks = [{
    name: t('termsConditions'),
    href: "/terms"
  }, {
    name: t('privacyPolicy'),
    href: "/privacy"
  }, {
    name: t('cookiePolicy'),
    href: "/cookies"
  }, {
    name: t('gdprDataRequests'),
    href: "/gdpr"
  }];
  return (
    <footer className="hidden md:block bg-black text-white mt-auto">
      {/* Main Footer Content */}
      <div className="py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Mobile: Simplified 2-column layout, Desktop: 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-12">
            {/* Brand Section */}
            <div className="col-span-2 lg:col-span-1 mb-4 lg:mb-0">
              {/* <Link to="/" className="inline-block mb-3 sm:mb-4">
                <img 
                  src="/lovable-uploads/4caf3f59-cdd8-4cc8-8a5e-63133057e521.png" 
                  alt="Kazaswap" 
                  className="h-6 sm:h-8 w-auto hover:opacity-80 transition-opacity" 
                />
              </Link> */}
              <p className="text-kaza-yellow font-medium text-xs sm:text-sm mb-4 sm:mb-6">
                {t('swapYourHomeExploreTheWorld')}
              </p>
              
              {/* Social Links - Always visible */}
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-kaza-yellow hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links - Mobile: Hidden, Desktop: Show */}
            <div className="hidden lg:block">
              <h4 className="font-semibold text-white mb-4">{t('product')}</h4>
              <nav className="space-y-3">
                {/* {productLinks.map((link) => (
                //   <Link
                //     key={link.name}
                //     to={link.href}
                //     className="block text-gray-300 hover:text-kaza-yellow transition-colors text-sm focus:outline-none focus:underline"
                //   >
                //     {link.name}
                //   </Link>
                ))} */}
              </nav>
            </div>

            {/* Company Links - Mobile: Show reduced list */}
            <div>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{t('company')}</h4>
              <nav className="space-y-2 sm:space-y-3">
                {/* {companyLinks.map((link) => (
                //   <Link
                //     key={link.name}
                //     to={link.href}
                //     className="block text-gray-300 hover:text-kaza-yellow transition-colors text-xs sm:text-sm focus:outline-none focus:underline"
                //   >
                //     {link.name}
                //   </Link>
                ))} */}
              </nav>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{t('legal')}</h4>
              <nav className="space-y-2 sm:space-y-3">
                {/* {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-gray-300 hover:text-kaza-yellow transition-colors text-xs sm:text-sm focus:outline-none focus:underline"
                  >
                    {link.name}
                  </Link>
                ))}*/}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-3 sm:py-4 lg:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Kazaswap. {t('allRightsReserved')}.
            </p>
            
            {/* Language Selector */}
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'fr' | 'pt')}>
              <SelectTrigger className="w-20 sm:w-24 h-7 sm:h-8 text-xs sm:text-sm bg-white/10 border-white/20 text-white">
                <SelectValue />
                <ChevronDown className="w-3 h-3" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
                <SelectItem value="pt">PT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Kazaswap",
            "url": "https://kazaswap.com",
            "logo": "https://kazaswap.com/assets/kaza-logo-hd.png",
            "sameAs": [
              "https://www.instagram.com/kazaswap.app/",
              "https://linkedin.com/company/kazaswap"
            ]
          })
        }}
      />
    </footer>
  );
};
export default Footer;
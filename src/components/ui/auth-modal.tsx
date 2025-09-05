import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
//   const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position when closing
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      if (document.body.style.position === 'fixed') {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };
  }, [isOpen]);

  const handleCreateAccount = () => {
    onClose();
    // navigate("/create-account");
  };

  const handleSignIn = () => {
    onClose();
    // navigate("/signin");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal backdrop - covers entire viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 999998,
              cursor: 'pointer'
            }}
          />
          
          {/* Modal content wrapper */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 9999999,
              pointerEvents: 'none'
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg", opacity: 0 }}
              animate={{ scale: 1, rotate: "0deg", opacity: 1 }}
              exit={{ scale: 0, rotate: "0deg", opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="sm:max-w-[400px] mx-4 rounded-3xl border-0 p-0 shadow-xl cursor-default relative overflow-hidden w-full max-w-lg"
              style={{ 
                backgroundColor: '#FFE361',
                pointerEvents: 'auto'
              }}
            >
              <div className="relative p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 hover:bg-black/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
                
                <div className="space-y-4 text-center pt-2">
                  <h2 className="text-2xl font-semibold text-black">
                    Create account
                  </h2>
                  <p className="text-black/80 text-sm">
                    Join our community to see more details and share your properties with others.
                  </p>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={handleSignIn}
                    variant="outline"
                    className="flex-1 bg-white text-black border-0 hover:bg-white/90 rounded-full h-12 font-medium"
                    data-visitor-modal-exclude="true"
                  >
                    Sign in
                  </Button>
                  <Button
                    onClick={handleCreateAccount}
                    className="flex-1 bg-black text-white hover:bg-black/90 rounded-full h-12 font-medium"
                    data-visitor-modal-exclude="true"
                  >
                    Create account
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
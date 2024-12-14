import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LoginModalContent({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    // Store current path for redirect after login
    const currentPath = window.location.pathname + window.location.search;
    const callbackUrl = encodeURIComponent(currentPath);
    
    // Navigate to signin page with callback
    router.push(`/auth/signin?callbackUrl=${callbackUrl}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Unlock Clue Feature
                </h2>
                <p className="text-gray-600">
                  Sign in to access game clues and enhance your WordWise experience!
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={handleLogin}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                    />
                  </svg>
                  Sign In to Continue
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  By signing in, you'll get access to:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Three levels of helpful clues
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Progress tracking
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Personalized game statistics
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function LoginModal(props: LoginModalProps) {
  return (
    <Suspense fallback={null}>
      <LoginModalContent {...props} />
    </Suspense>
  );
}

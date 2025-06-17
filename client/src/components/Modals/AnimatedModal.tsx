import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Portal from "@/components/Portal/Portal";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose?: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "left-center"
    | "center"
    | "right-center"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  maxHeight?: string;
  scrollable?: boolean;
  zIndex?:number;
  animationType?: "fade" | "slideUp" | "scale";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "w-full h-full",
};

const positionClasses = {
  "top-left": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-right": "items-start justify-end",

  "left-center": "items-center justify-start",
  center: "items-center justify-center",
  "right-center": "items-center justify-end",

  "bottom-left": "items-end justify-start",
  "bottom-center": "items-end justify-center",
  "bottom-right": "items-end justify-end",
};

// Motion Variants
const modalVariants: Record<
  NonNullable<AnimatedModalProps["animationType"]>,
  Variants
> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  },
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
};

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose=true,
  closeModal,
  children,
  showCloseButton = true,
  size = "md",
  position = "center",
  maxHeight = "100vh",
  scrollable = true,
  animationType = "scale",
  zIndex=999
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    if (isOpen && onClose) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal]);

  
  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            className={`fixed inset-0 m-0 flex ${positionClasses[position]} backdrop-blur-sm bg-black/5`}
            style={{zIndex}}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants.fade}
          >
            <motion.div
              ref={modalRef}
              className={`relative p-4 w-full max-h-full ${sizeClasses[size]} ${positionClasses[position]}`}
              onClick={(e) => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants[animationType]}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                )}
                <div
                  className={`${scrollable ? "overflow-y-auto" : ""}`}
                  style={{
                    maxHeight: scrollable
                      ? `calc(${maxHeight} - 2rem)`
                      : "auto",
                  }}
                >
                  {children}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;

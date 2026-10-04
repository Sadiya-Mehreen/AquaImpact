import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONE_CLASSES = {
  success: "text-leaf-600",
  error: "text-red-500",
  info: "text-aqua-600",
};

export function ToastHost() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 pt-safe md:top-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="glass pointer-events-auto flex max-w-sm items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-aqua-900 shadow-aqua-lg"
            >
              <Icon className={`h-4 w-4 shrink-0 ${TONE_CLASSES[t.tone]}`} />
              {t.message}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

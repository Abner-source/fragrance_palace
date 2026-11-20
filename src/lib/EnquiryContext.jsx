import { createContext, useCallback, useContext, useRef, useState } from "react";
import CONFIG from "../data/config.js";

/*
  All "Enquire on WhatsApp" buttons go through enquire().
  While CONFIG.whatsappNumber is empty, a "coming soon" toast is shown.
  Once a number is set, WhatsApp opens with a prefilled message.
*/

const EnquiryContext = createContext(null);

export function enquiryText(product, ml) {
  if (!product) return CONFIG.generalEnquiry;
  const brand = product.name?.startsWith(product.brand) ? null : product.brand;
  const label = [brand, product.name, product.type].filter(Boolean).join(" ") + (ml ? ` (${ml}ml)` : "");
  return CONFIG.enquiryTemplate.replace("{product}", label);
}

export function whatsappUrl(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function EnquiryProvider({ children }) {
  const [toast, setToast] = useState("");
  const timer = useRef();

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3600);
  }, []);

  const enquire = useCallback(
    (product, ml) => {
      const message = enquiryText(product, ml);
      if (!CONFIG.whatsappNumber) {
        showToast("WhatsApp enquiries are coming soon. Please visit us in store in the meantime.");
        return;
      }
      window.open(whatsappUrl(message), "_blank", "noopener");
    },
    [showToast]
  );

  return (
    <EnquiryContext.Provider value={{ enquire, showToast }}>
      {children}
      <div className={`toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </EnquiryContext.Provider>
  );
}

export const useEnquiry = () => useContext(EnquiryContext);

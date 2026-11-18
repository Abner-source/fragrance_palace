/* ==========================================================
   FRAGRANCE PALACE — site configuration
   Edit these values; everything on the site reads from here.
   ========================================================== */
const CONFIG = {
  storeName: "Fragrance Palace",
  city: "Dubai",

  // WhatsApp number all enquiries are sent to (+971 52 986 1940).
  // International format, digits only, no "+".
  whatsappNumber: "971529861940",

  // Opening message prefilled in WhatsApp. {product} is replaced automatically.
  enquiryTemplate:
    "Hello Fragrance Palace, I'd like to enquire about {product}. Is it available, and what is the price?",
  generalEnquiry: "Hello Fragrance Palace, I have a question about your fragrances.",

  currency: "AED",

  // Store details shown in the "Visit us" section and footer. Replace placeholders.
  address: "7893+X9P – Naif – Al Sabkha, Dubai, United Arab Emirates",
  hours: "[Opening hours]",
  phoneDisplay: "+971 52 986 1940",
  phone: "+971529861940",
  mapUrl: "https://www.google.com/maps/dir/?api=1&destination=25.270000,55.303472",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3608.0171630444743!2d55.30089947538447!3d25.270008077664283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDE2JzEyLjAiTiA1NcKwMTgnMTIuNSJF!5e0!3m2!1sen!2sae!4v1794494951256!5m2!1sen!2sae",
};

export default CONFIG;

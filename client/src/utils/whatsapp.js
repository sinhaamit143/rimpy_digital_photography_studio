export const openWhatsApp = (productTitle, price) => {
  const phoneNumber = "447947129801"; // Updated to user's number (assuming UK format based on 07... prefix, adding +44)
  const message = `Hi! I am interested in purchasing ${productTitle} listed at ${price}.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

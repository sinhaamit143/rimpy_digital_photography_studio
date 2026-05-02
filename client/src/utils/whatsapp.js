export const openWhatsApp = (productTitle, price) => {
  const phoneNumber = "919812411818";
  const message = `Hi! I am interested in purchasing ${productTitle} listed at ${price}.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

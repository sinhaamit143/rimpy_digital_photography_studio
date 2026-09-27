const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const shareProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.redirect('/shop/products');
    }

    const product = await prisma.product.findUnique({
      where: { id: parsedId },
      include: { category: true }
    });

    if (!product) {
      return res.redirect('/shop/products');
    }

    // Derive base URL from request — works on both localhost and production
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const productPageUrl = `${baseUrl}/shop/${product.id}`;

    // Build fully-qualified image URL
    const imageUrl = product.imageUrl?.startsWith('http')
      ? product.imageUrl
      : `${baseUrl}${product.imageUrl}`;

    const title = `${product.title} — Rimpy Gifts Studio`;
    const priceFormatted = `₹${parseFloat(product.price).toLocaleString('en-IN')}`;
    const description = product.description
      ? `${priceFormatted} — ${product.description.slice(0, 160)}`
      : `${priceFormatted} — Premium personalized gift from Rimpy Gifts Studio, Karnal.`;

    // Escape any HTML special chars to avoid XSS in meta content
    const escape = (str) =>
      String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escape(title)}</title>

  <!-- Primary Meta -->
  <meta name="title" content="${escape(title)}" />
  <meta name="description" content="${escape(description)}" />

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Rimpy Gifts Studio" />
  <meta property="og:url" content="${escape(productPageUrl)}" />
  <meta property="og:title" content="${escape(title)}" />
  <meta property="og:description" content="${escape(description)}" />
  <meta property="og:image" content="${escape(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1200" />
  <meta property="og:image:alt" content="${escape(product.title)}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escape(title)}" />
  <meta name="twitter:description" content="${escape(description)}" />
  <meta name="twitter:image" content="${escape(imageUrl)}" />

  <!-- Instant redirect for real users -->
  <meta http-equiv="refresh" content="0;url=${escape(productPageUrl)}" />
</head>
<body style="font-family:sans-serif;text-align:center;padding:40px;background:#f9f9f9;color:#333">
  <h2 style="margin-bottom:8px">${escape(product.title)}</h2>
  <p style="color:#cc141b;font-weight:bold;margin-bottom:16px">${escape(priceFormatted)}</p>
  <p>Redirecting to product page...</p>
  <a href="${escape(productPageUrl)}" style="color:#cc141b">Click here if not redirected automatically</a>
  <script>window.location.replace('${productPageUrl}');</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Allow WhatsApp/crawlers to cache preview for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
  } catch (error) {
    console.error('shareProduct error:', error);
    res.redirect('/shop/products');
  }
};

module.exports = { shareProduct };

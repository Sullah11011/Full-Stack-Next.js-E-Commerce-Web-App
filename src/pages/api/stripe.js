import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("Cart Items from post handler: ",req.body.items);
    // Check that the request is a POST request.
    try {
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                { shipping_rate: 'shr_1MjpICDRkuVPyzRPBA4cqWHr'},
                { shipping_rate: 'shr_1MjpK7DRkuVPyzRP9mcRDQEt'},
            ],
            line_items: req.body.items.map((item) =>{
                const img = item.image[0].asset._ref; // asset.ref was the error for 500 internal server error
                const newImage = img.replace('image-', 'https://cdn.sanity.io/images/co8jpbn3/production/').replace('-webp', '.webp');
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                            images: [newImage]
                        },
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/`,
        }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
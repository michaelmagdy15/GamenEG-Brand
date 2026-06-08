// src/services/paymob.ts

interface BillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  street: string;
  apartment?: string;
  floor?: string;
  building?: string;
}

export interface PaymobSessionResponse {
  iframeUrl: string;
  paymobOrderId?: string;
}

const PAYMOB_API_BASE = 'https://accept.paymob.com/api';

/**
 * Checks whether to use Mock Payment Mode or real Paymob API endpoints.
 * Falls back to Mock Mode if environment variables are not configured.
 */
export const isPaymobMockMode = (): boolean => {
  const mockFlag = import.meta.env.VITE_PAYMOB_USE_MOCK;
  const apiKey = import.meta.env.VITE_PAYMOB_API_KEY;
  const integrationId = import.meta.env.VITE_PAYMOB_INTEGRATION_ID;
  const iframeId = import.meta.env.VITE_PAYMOB_IFRAME_ID;

  // Use mock if toggled on OR if configuration is incomplete
  return mockFlag === 'true' || !apiKey || !integrationId || !iframeId;
};

/**
 * Initiates payment session with Paymob.
 * In Mock Mode, it routes to a beautiful interactive mock interface.
 * In Live Mode, it makes sequence calls to Paymob Accept endpoints.
 */
export async function createPaymobSession(
  orderRef: string,
  totalPriceEGP: number,
  customerData: {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
  },
  items: Array<{ productName: string; price: number; quantity: number }>
): Promise<PaymobSessionResponse> {
  const amountCents = Math.round(totalPriceEGP * 100);

  if (isPaymobMockMode()) {
    console.log('[Paymob Service] Running in Mock Sandbox Mode.');
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Construct local mock payment URL
    const params = new URLSearchParams({
      token: `mock_payment_token_${Math.random().toString(36).substring(2, 12)}`,
      orderRef,
      amount: totalPriceEGP.toString(),
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
    });

    return {
      iframeUrl: `/payment-mock?${params.toString()}`,
      paymobOrderId: `MOCK-ORDER-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  }

  // --- Real Paymob API Calls (Requires server proxy to prevent CORS/exposure if disabled) ---
  try {
    const apiKey = import.meta.env.VITE_PAYMOB_API_KEY;
    const integrationId = parseInt(import.meta.env.VITE_PAYMOB_INTEGRATION_ID || '0', 10);
    const iframeId = import.meta.env.VITE_PAYMOB_IFRAME_ID;

    console.log('[Paymob Service] Initiating actual Paymob API sequence.');

    // 1. Authenticate Request
    const authRes = await fetch(`${PAYMOB_API_BASE}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
    if (!authRes.ok) throw new Error(`Authentication failed: ${authRes.statusText}`);
    const authData = await authRes.json();
    const token = authData.token;

    // 2. Order Registration
    const paymobItems = items.map((i) => ({
      name: i.productName,
      amount_cents: Math.round(i.price * 100),
      quantity: i.quantity,
      description: i.productName,
    }));

    const orderRes = await fetch(`${PAYMOB_API_BASE}/ecommerce/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: 'false',
        amount_cents: amountCents,
        currency: 'EGP',
        merchant_order_id: orderRef,
        items: paymobItems,
      }),
    });
    if (!orderRes.ok) throw new Error(`Order registration failed: ${orderRes.statusText}`);
    const orderData = await orderRes.json();
    const paymobOrderId = orderData.id.toString();

    // 3. Request Payment Key (Token)
    const nameParts = customerData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Gamen';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    const billingData: BillingData = {
      first_name: firstName,
      last_name: lastName,
      email: customerData.email,
      phone_number: customerData.phone.startsWith('+2') ? customerData.phone : `+2${customerData.phone}`,
      city: customerData.city,
      street: customerData.address.substring(0, 50), // limits length for safety
      apartment: 'NA',
      floor: 'NA',
      building: 'NA',
    };

    const keyRes = await fetch(`${PAYMOB_API_BASE}/acceptance/payment_keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: billingData,
        currency: 'EGP',
        integration_id: integrationId,
        lock_order_to_card: false,
      }),
    });
    if (!keyRes.ok) throw new Error(`Payment key generation failed: ${keyRes.statusText}`);
    const keyData = await keyRes.json();
    const paymentKey = keyData.token;

    // 4. Return secure Iframe URL
    return {
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`,
      paymobOrderId,
    };
  } catch (error) {
    console.error('[Paymob Service Error]', error);
    throw error;
  }
}

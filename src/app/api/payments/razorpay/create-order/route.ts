import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real Razorpay keys are provided, we can call Razorpay standard orders API
    if (keyId && keySecret && !keyId.includes('sample') && !keySecret.includes('sample')) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount), // in paise
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          payment_capture: 1,
        }),
      });

      const orderData = await response.json();
      if (!response.ok) {
        return NextResponse.json({ error: orderData.error?.description || 'Razorpay order creation failed' }, { status: response.status });
      }

      return NextResponse.json(orderData);
    }

    // High fidelity test simulator response
    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    return NextResponse.json({
      id: mockOrderId,
      entity: 'order',
      amount: Math.round(amount),
      currency: currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      is_simulated: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

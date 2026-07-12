import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "re_Fc1tCHZW_7U3WEUz5cRhgXVZtqxd2pxUA";
const FROM_EMAIL = "onboarding@resend.dev";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, to, code, orderDetails } = body as {
      type: "verification" | "confirmation";
      to: string;
      code?: string;
      orderDetails?: {
        orderNumber: string;
        name: string;
        items: { name: string; qty: number; price: number }[];
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        estimatedMinutes: number;
        address: string;
      };
    };

    if (!to || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (type, to)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject: string;
    let html: string;

    if (type === "verification") {
      if (!code) {
        return new Response(
          JSON.stringify({ error: "Missing verification code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      subject = "Your Pizza Town Verification Code";
      html = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 8px;">🍕</div>
            <h1 style="color: #FFF8E7; font-size: 24px; margin: 0;">Pizza Town Sukkur</h1>
            <p style="color: #FFB100; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 4px 0 0;">Email Verification</p>
          </div>
          <p style="color: #FFF8E7; font-size: 16px; line-height: 1.6;">Hi there! Use the code below to verify your email and continue with your order.</p>
          <div style="text-align: center; margin: 32px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #FF4D00, #FFB100); padding: 20px 48px; border-radius: 16px;">
              <span style="color: #FFF8E7; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${code}</span>
            </div>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.5; text-align: center;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />
          <p style="color: #555; font-size: 11px; text-align: center;">Pizza Town Sukkur · Military Road · Est. Sukkur</p>
        </div>
      `;
    } else if (type === "confirmation") {
      if (!orderDetails) {
        return new Response(
          JSON.stringify({ error: "Missing order details" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const itemsHtml = orderDetails.items
        .map(
          (item) =>
            `<tr><td style="padding: 8px 0; color: #FFF8E7; font-size: 14px;">${item.name} × ${item.qty}</td><td style="padding: 8px 0; color: #FFF8E7; font-size: 14px; text-align: right;">Rs. ${(item.price * item.qty).toLocaleString()}</td></tr>`
        )
        .join("");

      subject = `Order Confirmed — ${orderDetails.orderNumber}`;
      html = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 8px;">🍕</div>
            <h1 style="color: #FFF8E7; font-size: 24px; margin: 0;">Order Confirmed!</h1>
            <p style="color: #FFB100; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 4px 0 0;">Thank you, ${orderDetails.name}!</p>
          </div>

          <div style="background: #141414; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">Order Number</td><td style="color: #FFB100; font-size: 18px; font-weight: bold; text-align: right; padding-bottom: 8px;">${orderDetails.orderNumber}</td></tr>
              <tr><td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px; border-top: 1px solid #222; padding-top: 12px;">Estimated Time</td><td style="color: #FFF8E7; font-size: 16px; text-align: right; padding-top: 12px; border-top: 1px solid #222;">${orderDetails.estimatedMinutes} minutes</td></tr>
              <tr><td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-top: 8px; border-top: 1px solid #222; padding-top: 12px;">Payment</td><td style="color: #FFF8E7; font-size: 14px; text-align: right; padding-top: 12px; border-top: 1px solid #222;">${orderDetails.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}</td></tr>
              <tr><td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-top: 12px; border-top: 1px solid #222;">Deliver To</td><td style="color: #FFF8E7; font-size: 13px; text-align: right; padding-top: 12px; border-top: 1px solid #222; max-width: 250px;">${orderDetails.address}</td></tr>
            </table>
          </div>

          <h2 style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            ${itemsHtml}
            <tr><td style="padding-top: 12px; border-top: 1px solid #222; color: #888; font-size: 13px;">Subtotal</td><td style="padding-top: 12px; border-top: 1px solid #222; color: #FFF8E7; font-size: 13px; text-align: right;">Rs. ${orderDetails.subtotal.toLocaleString()}</td></tr>
            <tr><td style="color: #888; font-size: 13px; padding-top: 4px;">Delivery Fee</td><td style="color: #FFF8E7; font-size: 13px; text-align: right; padding-top: 4px;">Rs. ${orderDetails.deliveryFee.toLocaleString()}</td></tr>
            <tr><td style="padding-top: 12px; border-top: 1px solid #222; color: #FFF8E7; font-size: 16px; font-weight: bold;">Total</td><td style="padding-top: 12px; border-top: 1px solid #222; color: #FFB100; font-size: 18px; font-weight: bold; text-align: right;">Rs. ${orderDetails.total.toLocaleString()}</td></tr>
          </table>

          <p style="color: #888; font-size: 13px; line-height: 1.6; text-align: center; margin-top: 24px;">We're firing up the oven! Your order will be delivered in approximately <strong style="color: #FFB100;">${orderDetails.estimatedMinutes} minutes</strong>.</p>

          <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />
          <p style="color: #555; font-size: 11px; text-align: center;">Pizza Town Sukkur · Military Road · Est. Sukkur</p>
        </div>
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY secret not configured. Add it in Supabase dashboard under Edge Function secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Pizza Town <${FROM_EMAIL}>`,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ error: `Resend API error: ${res.status} ${errText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

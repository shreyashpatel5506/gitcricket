import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 1. Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const adminEmail = 'shreyashpatel5506@gmail.com';
    const brevoApiKey = process.env.BREVO_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    // 2. Email payload details
    const mailToAdminSubject = `[GitCric Contact] ${subject || 'New Message'} from ${name}`;
    const mailToAdminHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 16px;">
          New GitCric Contact Submission
        </h2>
        <p style="margin: 8px 0;"><strong style="color: #475569;">Sender Name:</strong> ${name}</p>
        <p style="margin: 8px 0;"><strong style="color: #475569;">Sender Email:</strong> <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
        <p style="margin: 8px 0;"><strong style="color: #475569;">Subject:</strong> ${subject || 'N/A'}</p>
        <div style="margin-top: 16px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #cbd5e1;">
          <p style="margin: 0; font-weight: 600; color: #475569; margin-bottom: 8px;">Message:</p>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; color: #334155;">${message}</p>
        </div>
      </div>
    `;

    const mailToUserSubject = `Thanks for connecting with GitCric!`;
    const mailToUserHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <h2 style="font-size: 20px; font-weight: 800; color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 16px;">
          Thanks for reaching out!
        </h2>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Hi ${name},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">
          Thank you for connecting with GitCric. We have received your query regarding: 
          <strong style="color: #0f172a;">"${subject || 'General Inquiry'}"</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">
          Our team is looking into your details and will get back to you at this email address within 24-48 hours.
        </p>
        <div style="margin-top: 24px; border-t: 1px solid #e2e8f0; padding-top: 16px; font-size: 14px; color: #64748b;">
          <p style="margin: 0; font-weight: 700; color: #475569;">Best regards,</p>
          <p style="margin: 4px 0 0 0; color: #10b981; font-weight: 600;">The GitCric Team</p>
        </div>
      </div>
    `;

    // 3. Dispatch emails if Brevo API key is present
    if (brevoApiKey) {
      console.log('[Contact API] Sending contact emails via Brevo API...');

      // A. Send email to admin
      const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify({
          sender: { name: 'GitCric Support', email: adminEmail },
          to: [{ email: adminEmail, name: 'GitCric Admin' }],
          replyTo: { email: email, name: name },
          subject: mailToAdminSubject,
          htmlContent: mailToAdminHtml
        })
      });

      if (!adminResponse.ok) {
        const adminErr = await adminResponse.text();
        console.error('[Contact API] Brevo Admin mail dispatch failed:', adminErr);
        throw new Error('Failed to deliver message to administrator via Brevo.');
      }

      // B. Send email to user (thank you receipt)
      const userResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify({
          sender: { name: 'GitCric Team', email: adminEmail },
          to: [{ email: email, name: name }],
          subject: mailToUserSubject,
          htmlContent: mailToUserHtml
        })
      });

      if (!userResponse.ok) {
        const userErr = await userResponse.text();
        console.warn('[Contact API] Brevo User receipt dispatch failed:', userErr);
      }

      return NextResponse.json({ success: true, provider: 'brevo' });
    }

    // 4. Dispatch emails if Resend API key is present
    if (resendApiKey) {
      console.log('[Contact API] Sending contact emails via Resend API...');

      // A. Send email to admin
      const adminResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'GitCric Contact <onboarding@resend.dev>',
          to: [adminEmail],
          subject: mailToAdminSubject,
          html: mailToAdminHtml
        })
      });

      if (!adminResponse.ok) {
        const adminErr = await adminResponse.text();
        console.error('[Contact API] Resend Admin mail dispatch failed:', adminErr);
        throw new Error('Failed to deliver message to administrator.');
      }

      // B. Send email to user (thank you receipt)
      const userResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'GitCric Team <onboarding@resend.dev>',
          to: [email],
          subject: mailToUserSubject,
          html: mailToUserHtml
        })
      });

      if (!userResponse.ok) {
        const userErr = await userResponse.text();
        console.warn('[Contact API] Resend User receipt dispatch failed:', userErr);
        // We do not throw here to avoid failing the user form submit if only receipt fails
      }

      return NextResponse.json({ success: true, provider: 'resend' });
    }

    // 5. Fallback simulation for local testing/development
    console.log('--------------------------------------------------');
    console.log('[Contact API] Neither BREVO_API_KEY nor RESEND_API_KEY set. Simulating Email Dispatch.');
    console.log(`[Admin Mail] To: ${adminEmail} | Subject: ${mailToAdminSubject}`);
    console.log(`[User Mail] To: ${email} | Subject: ${mailToUserSubject}`);
    console.log('--------------------------------------------------');

    return NextResponse.json({ success: true, mock: true });

  } catch (err: any) {
    console.error('[Contact API] Internal Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

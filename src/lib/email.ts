import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASS,
  },
  tls: {
    rejectUnauthorized: false // This will allow self-signed certificates
  }
});

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Verify your email',
      html: `
        <p>Thanks for signing up! Click the link below to verify your email:</p>
        <p><a href="${link}">${link}</a></p>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Don't throw the error, just log it
    // This way registration can still succeed even if email fails
  }
}

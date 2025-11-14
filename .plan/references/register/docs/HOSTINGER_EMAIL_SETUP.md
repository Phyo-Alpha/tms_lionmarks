# Hostinger Email Setup Guide

## Option 1: Configure PHP mail() function (Simplest - Already Implemented)

The code already uses PHP's `mail()` function. To make it work with Hostinger:

### Step 1: Update Email Addresses in index.php

Edit `register/index.php` line 114-115 and change:

```php
$headers .= "From: Lionmarks Training <noreply@yourdomain.com>" . "\r\n";
$headers .= "Reply-To: training@yourdomain.com" . "\r\n";
```

Replace `yourdomain.com` with your actual domain.

### Step 2: Configure php.ini (if mail() doesn't work)

If PHP's mail() function doesn't work, add these settings to your `php.ini`:

```ini
[mail function]
SMTP = smtp.hostinger.com
smtp_port = 587
sendmail_from = noreply@yourdomain.com
```

---

## Option 2: Use SMTP with PHPMailer (Recommended for Production)

PHPMailer is more reliable and works better with Hostinger's SMTP.

### Step 1: Install PHPMailer

```bash
composer require phpmailer/phpmailer
```

### Step 2: Update the sendConfirmationEmail() function

Replace the `sendConfirmationEmail()` function in `index.php` with this:

```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendConfirmationEmail($data) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'noreply@yourdomain.com';  // Your Hostinger email
        $mail->Password   = 'your-password';            // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('noreply@yourdomain.com', 'Lionmarks Training');
        $mail->addAddress($data['email'], $data['firstName'] . ' ' . $data['lastName']);
        $mail->addReplyTo('training@yourdomain.com', 'Lionmarks Training');

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Workshop Registration Confirmation - Lionmarks Training';
        $mail->Body    = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
                .label { font-weight: bold; color: #667eea; }
                .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Registration Confirmed!</h1>
                    <p>Thank you for registering with Lionmarks Training</p>
                </div>
                <div class='content'>
                    <h2>Registration Details</h2>
                    <div class='info-row'><span class='label'>Name:</span> " . htmlspecialchars($data['firstName'] . ' ' . $data['lastName']) . "</div>
                    <div class='info-row'><span class='label'>Email:</span> " . htmlspecialchars($data['email']) . "</div>
                    <div class='info-row'><span class='label'>Phone:</span> " . htmlspecialchars($data['countryCode'] . ' ' . $data['phone']) . "</div>
                    <div class='info-row'><span class='label'>Workshop:</span> " . htmlspecialchars($data['workshop'] ?? 'Not selected') . "</div>

                    <div style='margin-top: 30px; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;'>
                        <strong>⚠️ Important Note:</strong><br>
                        We will contact you regarding a $30 refundable deposit.<br>
                        This deposit will be returned upon course completion.
                    </div>
                </div>
                <div class='footer'>
                    <p>© 2025 Lionmarks Training. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email Error: {$mail->ErrorInfo}");
        return false;
    }
}
```

---

## Hostinger Email Settings

When you create an email in Hostinger, use these settings:

- **SMTP Server**: smtp.hostinger.com
- **SMTP Port**:
  - 587 (TLS/STARTTLS) - Recommended
  - 465 (SSL)
  - 25 (Non-encrypted)
- **SMTP Authentication**: Yes
- **Username**: Your full email address (e.g., noreply@yourdomain.com)
- **Password**: Your email password

---

## Testing

### Test if mail() works:

Create a test file `test-email.php`:

```php
<?php
$to = "your-test-email@gmail.com";
$subject = "Test Email";
$message = "This is a test email";
$headers = "From: noreply@yourdomain.com\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully!";
} else {
    echo "Email failed to send.";
}
?>
```

Access it via browser: `http://localhost:8000/register/test-email.php`

---

## Troubleshooting

1. **Email not sending**:

   - Check if your email password is correct
   - Verify your domain is pointing to Hostinger
   - Check spam/junk folder
   - Enable error reporting in PHP

2. **Authentication failed**:

   - Make sure you're using the full email address as username
   - Check if 2FA is enabled on your email (disable it or use app password)

3. **Connection timeout**:
   - Try port 465 with SSL instead of 587 with TLS
   - Check if your firewall is blocking SMTP ports

---

## Security Tips

1. **Never commit email passwords to Git**:

   - Create a `.env` file for sensitive data
   - Add `.env` to `.gitignore`

2. **Use environment variables**:

   ```php
   $smtp_password = getenv('SMTP_PASSWORD');
   ```

3. **Rate limiting**:
   - Implement CAPTCHA to prevent spam
   - Limit registration submissions per IP

---

## Current Status

✅ Email function is already implemented in `register/index.php`
✅ Beautiful HTML email template included
⚠️ You need to update email addresses (lines 114-115)
⚠️ May need PHPMailer if mail() doesn't work on your server

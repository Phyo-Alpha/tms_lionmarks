# PayNow QR Code Integration for Email

This integration generates dynamic PayNow QR codes for each registration email with the exact payment amount and reference number.

## How It Works

1. **paynow-helper.php** - PHP implementation of PayNow QR code generator
2. **mail.php** - Updated to generate and embed QR codes in emails

## Current Setup (Using Google Charts API)

The current implementation uses Google Charts API to generate QR codes. This is simple but has limitations:

- Requires internet connection
- Dependent on external service
- Google Charts API may be deprecated in the future

## Recommended Setup (Using PHP QR Code Library)

### Step 1: Install PHP QR Code Library

```bash
composer require chillerlan/php-qrcode
```

### Step 2: Update paynow-helper.php

Replace the `generateQRCodeFile` method with the improved version below.

## Configuration

Update these values in `mail.php` (around line 99):

```php
$uen = 'YOUR_ACTUAL_UEN';  // Your Singapore UEN number
$entityName = 'Your Company Name';  // Your company name
```

## Features

✅ **Dynamic QR Codes** - Each email gets a unique QR code with:

- Specific payment amount (including GST)
- Unique order reference number
- Your company UEN
- Company name

✅ **Email Compatible** - QR code is embedded as an inline image (not iframe)

✅ **Automatic Cleanup** - Temporary QR code files are deleted after sending

✅ **Fallback** - Falls back to static image if generation fails

## Testing

To test if the QR code works:

1. Send a test email
2. Open email on mobile device
3. Scan the QR code with any Singapore banking app that supports PayNow
4. Verify the amount and reference number appear correctly

## Troubleshooting

### QR Code not showing in email

- Check if `register/mail/logs/` directory exists and is writable
- Check email debug logs at `register/mail/logs/phpmailer_debug.log`

### QR Code not scanning

- Verify your UEN is correct
- Check that the amount format is correct (must be numeric)
- Ensure reference number doesn't contain special characters

### Using static QR code instead

If you want to use a static QR code (same for all emails), simply keep the existing:

```php
$mail->addEmbeddedImage(__DIR__ . '/../assets/images/paynow.jpg', 'paynow_qr');
```

## Alternative: Generate QR Code without external service

If you want to avoid external dependencies, install the library:

```bash
composer require chillerlan/php-qrcode
```

Then update `paynow-helper.php` to use the library instead of Google Charts API.

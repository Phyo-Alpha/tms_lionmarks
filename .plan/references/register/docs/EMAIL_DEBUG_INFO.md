# Email Debugging Information

## Changes Made

### 1. Debug Logging to File

- All PHPMailer debug output is now saved to `register/logs/phpmailer_debug.log`
- Debug messages are NOT displayed on the website (better security)
- The logs directory is created automatically if it doesn't exist

### 2. Improved Email Configuration

- **Character Encoding**: Set to UTF-8 with base64 encoding
- **Plain Text Alternative**: Added AltBody for email clients that don't support HTML
- **Simplified HTML**: Removed emojis and CSS gradients that could cause delivery issues
- **DOCTYPE Added**: Proper HTML5 document structure

### 3. Enhanced Error Logging

- Errors are logged to both PHP error log and debug file
- Success messages also logged to debug file
- More detailed error information captured

## Key Differences from test-email.php

**Working Version (test-email.php)**:

- Simple HTML content
- Debug output visible on screen (SMTPDebug = 2)
- Basic configuration

**Production Version (index.php)**:

- Complex HTML with embedded styles
- Debug output saved to file (not visible to users)
- Character encoding explicitly set
- Plain text alternative provided
- Better security (no visible debug info)

## How to Check Debug Logs

1. After submitting a form, check the log file:

   ```
   register/logs/phpmailer_debug.log
   ```

2. The log contains:
   - SMTP connection details
   - Authentication process
   - Email sending status
   - Any errors encountered

## Common Issues and Solutions

### Email Says "Sent Successfully" But Not Received

**Possible Causes:**

1. **Spam/Junk Folder**: Check recipient's spam folder
2. **Email Server Delay**: Sometimes takes 5-10 minutes
3. **Domain Authentication**:
   - Check SPF records for lionmark.com.sg
   - Check DKIM settings
   - Check DMARC policy
4. **Recipient Server Blocking**: Some servers silently reject emails
5. **Content Filtering**: Certain words or HTML might trigger spam filters

**To Debug:**

- Check `register/logs/phpmailer_debug.log` for SMTP server responses
- Look for "250 OK" or "250 Accepted" messages (means server accepted the email)
- Check for any error codes (550, 551, 552, 553, etc.)

### How to Test

1. **Test with multiple email providers**:

   - Gmail
   - Outlook/Hotmail
   - Yahoo
   - Company email

2. **Check the debug log** for each attempt

3. **Compare with test-email.php** which works

## Recommended Next Steps

1. **Add Email Verification**: Consider using the "verify-email" functionality
2. **Monitor Logs**: Regularly check debug logs for patterns
3. **Email Deliverability**:
   - Set up SPF record for your domain
   - Enable DKIM signing
   - Configure DMARC policy
4. **Backup Email**: Consider using a service like SendGrid or Mailgun as backup

## Security Notes

- Debug logs may contain sensitive information (email addresses, timestamps)
- The logs directory should not be publicly accessible
- Consider adding `.htaccess` to prevent direct access to logs
- Rotate/clear logs periodically

## Files Modified

- `register/index.php` - Main registration form with debug logging
- `register/.gitignore` - Excludes logs from version control
- `register/EMAIL_DEBUG_INFO.md` - This file

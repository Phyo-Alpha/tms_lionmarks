# Lionmarks Training Registration System

A PHP-based workshop registration system with email notifications and database storage.

## 🚀 Quick Setup

### 1. Configuration Setup

1. **Copy the sample config file:**

   ```bash
   cp config/app-config-sample.php config/app-config.php
   ```

2. **Edit `config/app-config.php` with your credentials:**

   ```php
   // Database Configuration
   define('DB_HOST', '127.0.0.1');
   define('DB_PORT', '3309');
   define('DB_NAME', 'lionmarks_tms');
   define('DB_USER', 'your_db_username');
   define('DB_PASS', 'your_db_password');

   // Email Configuration (Hostinger)
   define('SMTP_USERNAME', 'your-email@yourdomain.com');
   define('SMTP_PASSWORD', 'your_email_password');
   ```

### 2. Database Setup

1. **Create the database table:**
   ```sql
   USE lionmarks_tms;
   SOURCE migrations/workshop_registrations.sql;
   ```

### 3. Email Setup

1. **Create email account in Hostinger:**

   - Go to Hostinger hPanel
   - Create email: `admin@yourdomain.com`
   - Set password

2. **Test email configuration:**
   ```bash
   # Visit: http://localhost:8000/register/test-email.php
   # Update the test email address in the file
   ```

### 4. Install Dependencies

```bash
cd register
composer install
```

## 📁 File Structure

```
register/
├── config/
│   ├── app-config.php          # Main config (add to .gitignore)
│   ├── app-config-sample.php   # Sample config
│   ├── Database.php            # Database connection class
│   └── EmailService.php        # Email service class
├── assets/
│   └── css/
│       └── register.css        # Custom styles
├── vendor/                     # Composer dependencies
├── index.php                   # Main registration form
├── test-email.php              # Email testing script
├── composer.json               # Composer dependencies
└── .gitignore                  # Git ignore rules
```

## 🔧 Configuration Options

### Database Settings

- `DB_HOST`: Database host (usually localhost or 127.0.0.1)
- `DB_PORT`: Database port (3306 for MySQL, 3309 for Docker)
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASS`: Database password

### Email Settings (Hostinger)

- `SMTP_HOST`: smtp.hostinger.com
- `SMTP_PORT`: 465 (SSL) or 587 (TLS)
- `SMTP_USERNAME`: Your full email address
- `SMTP_PASSWORD`: Your email password
- `SMTP_ENCRYPTION`: 'ssl' for port 465, 'tls' for port 587

### Application Settings

- `APP_NAME`: Your company name
- `APP_URL`: Your website URL
- `ADMIN_EMAIL`: Admin notification email
- `DEBUG_MODE`: true for development, false for production

## 📧 Email Features

- **User Confirmation**: Beautiful HTML email sent to registrant
- **Admin Notification**: Email sent to admin when someone registers
- **Error Handling**: Comprehensive error logging and handling
- **Timeout Protection**: Prevents hanging on email failures

## 🗄️ Database Features

- **Prepared Statements**: SQL injection protection
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Comprehensive error logging
- **Transaction Support**: Ready for complex operations

## 🔒 Security Features

- **Configuration Protection**: Sensitive data in .gitignore
- **SQL Injection Prevention**: Prepared statements
- **Input Validation**: Server-side validation
- **Error Logging**: Detailed error tracking

## 🧪 Testing

### Test Email Configuration

```bash
# Visit: http://localhost:8000/register/test-email.php
# Check browser console and server logs for detailed output
```

### Test Database Connection

```php
// Add this to any PHP file for testing:
require_once 'config/app-config.php';
require_once 'config/Database.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
    echo "✅ Database connection successful!";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage();
}
```

## 🚨 Troubleshooting

### Email Issues

1. **Check Hostinger email settings**
2. **Verify email account exists**
3. **Check spam folder**
4. **Enable debug mode** (`SMTPDebug = 2`)

### Database Issues

1. **Check database credentials**
2. **Verify database exists**
3. **Check port configuration**
4. **Review error logs**

### Common Errors

- **"Class not found"**: Run `composer install`
- **"Connection failed"**: Check database credentials
- **"Email not sending"**: Check SMTP settings and credentials

## 📝 Logs

Error logs are written to PHP's error log. Check:

- **Windows**: `C:\xampp\apache\logs\error.log`
- **Linux/Mac**: `/var/log/apache2/error.log`

## 🔄 Updates

To update configuration:

1. Edit `config/app-config.php`
2. No need to restart server (PHP loads config on each request)
3. Test changes with `test-email.php`

## 📞 Support

For issues:

1. Check error logs
2. Test with `test-email.php`
3. Verify all credentials
4. Check Hostinger email settings

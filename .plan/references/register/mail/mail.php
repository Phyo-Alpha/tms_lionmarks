<?php

require_once __DIR__ . '/../../class/phpformbuilder/mailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/../../class/phpformbuilder/mailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../../class/phpformbuilder/mailer/phpmailer/src/SMTP.php';
require_once __DIR__ . '/../../conf/conf.php';

require_once __DIR__ . '/../../model/Course.php';
require_once __DIR__ . '/paynow-helper.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Function to send confirmation email
function sendConfirmationEmail($data)
{
    $mail = new PHPMailer(true);
    error_log("Sending confirmation email to " . $data['email'] . " with subject " . 'Workshop Registration Confirmation - Lionmarks Training');

    // Set up debug logging to file
    $debugLogFile = __DIR__ . '/logs/phpmailer_debug.log';

    // Create logs directory if it doesn't exist
    if (!file_exists(__DIR__ . '/logs')) {
        mkdir(__DIR__ . '/logs', 0755, true);
    }

    $course = Course::find($data['course_id']);

    if (!$course) {
        error_log("Course not found for course_id: " . $data['course_id']);
        return false;
    }

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = SMTP_PORT;

        // Enable debug output but save to file instead of displaying
        $mail->SMTPDebug = 2; // Enable verbose debug output
        $mail->Debugoutput = function ($str, $level) use ($debugLogFile) {
            file_put_contents($debugLogFile, date('Y-m-d H:i:s') . " [Level $level]: $str\n", FILE_APPEND);
        };

        // Timeout settings to prevent hanging
        $mail->Timeout = 30;
        $mail->SMTPKeepAlive = false;

        // Character encoding
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        // Recipients
        $mail->setFrom(address: 'admin@lionmark.com.sg', name: 'Lionmarks Training');
        $mail->addAddress(address: $data['email'], name: $data['firstName'] . ' ' . $data['lastName']);
        $mail->addReplyTo(address: 'admin@lionmark.com.sg', name: 'Lionmarks Training');

        $mail->addEmbeddedImage(__DIR__ . '/../assets/images/Lionmarks Logo.png', 'lionmarks_logo');

        // Content
        $mail->isHTML(isHtml: true);
        $mail->Subject = 'Workshop Registration Confirmation - Lionmarks Training';

        $html = file_get_contents(__DIR__ . '/templates/email-template.html');

        // Prepare data with defaults for missing fields
        $toName = $data['firstName'] . ' ' . $data['lastName'];
        $orderNumber = 'WS-' . date('Ymd') . '-' . rand(1000, 9999);
        $todayDate = date('F j, Y');
        $phone = ($data['countryCode'] ?? '') . ' ' . ($data['phone'] ?? '');
        $classStartDate = !empty($data['classStartDate']) ? date('F j, Y', strtotime($data['classStartDate'])) : 'To be confirmed';

        // Replace placeholders
        $html = str_replace('{{to_name}}', $toName, $html);
        $html = str_replace('{{order_number}}', $orderNumber, $html);
        $html = str_replace('{{today_date}}', $todayDate, $html);
        $html = str_replace('{{address}}', $data['address'] ?? '', $html);
        $html = str_replace('{{email}}', $data['email'] ?? '', $html);
        $html = str_replace('{{phone}}', $phone, $html);
        $html = str_replace('{{course}}', $course->course_title, $html);
        $html = str_replace('{{class_start_date}}', $classStartDate, $html);
        $html = str_replace('{{course_code}}', 'LM-' . substr(md5($course->course_title), 0, 6), $html);
        $html = str_replace('{{pax}}', '1', $html);
        $html = str_replace('{{course_price}}', 'SGD $350.00', $html);
        $html = str_replace('{{subtotal}}', 'SGD $350.00', $html);
        $html = str_replace('{{grand_total_excl_tax}}', 'SGD $350.00', $html);
        $html = str_replace('{{gst_percentage}}', '9', $html);
        $html = str_replace('{{gst_amount}}', 'SGD $31.50', $html);
        $html = str_replace('{{final_total}}', 'SGD $381.50', $html);

        // Generate PayNow QR Code with the final amount
        $finalTotal = 381.50; // This should match the calculated total above
        $uen = '201207337D'; // CHANGE TO YOUR ACTUAL UEN
        $entityName = 'Lionmarks Training'; // Your company name

        $payNowString = PayNowQRGenerator::generatePayNowString(
            $uen,
            $finalTotal,
            $entityName,
            $orderNumber, // Use the same order number generated above
            false // amount not editable
        );

        // Generate QR code and save temporarily
        $qrFilePath = __DIR__ . '/logs/paynow_qr_' . time() . '_' . rand(1000, 9999) . '.png';
        if (PayNowQRGenerator::generateQRCodeFile($payNowString, $qrFilePath)) {
            $mail->addEmbeddedImage($qrFilePath, 'paynow_qr');
            // Clean up temp file after email is sent
            register_shutdown_function(function () use ($qrFilePath) {
                if (file_exists($qrFilePath)) {
                    @unlink($qrFilePath);
                }
            });
        } else {
            // Fallback to existing static image if QR generation fails
            if (file_exists(__DIR__ . '/../assets/images/paynow.jpg')) {
                $mail->addEmbeddedImage(__DIR__ . '/../assets/images/paynow.jpg', 'paynow_qr');
            }
        }

        $mail->Body = $html;
        // Plain text alternative for email clients that don't support HTML
        $mail->AltBody = "Registration Confirmed!\n\n"
            . "Thank you for registering with Lionmarks Training\n\n"
            . "Registration Details:\n"
            . "Name: " . $data['firstName'] . ' ' . $data['lastName'] . "\n"
            . "Email: " . $data['email'] . "\n"
            . "Phone: " . $data['countryCode'] . ' ' . $data['phone'] . "\n"
            . "Workshop: " . ($data['workshop'] ?? 'Not selected') . "\n\n"
            . "Important Note:\n"
            . "We will contact you regarding a $30 refundable deposit.\n"
            . "This deposit will be returned upon course completion.\n\n"
            . "(c) 2025 Lionmarks Training. All rights reserved.";

        $mail->send();
        error_log("Email sent successfully to " . $data['email']);

        // Log success to debug file as well
        file_put_contents($debugLogFile, date('Y-m-d H:i:s') . " [SUCCESS]: Email sent to " . $data['email'] . "\n", FILE_APPEND);

        return true;
    } catch (Exception $e) {
        $errorMsg = "Email Error: " . $e->getMessage() . " | SMTP Error: " . $mail->ErrorInfo;
        error_log($errorMsg);

        // Log error to debug file as well
        file_put_contents($debugLogFile, date('Y-m-d H:i:s') . " [ERROR]: " . $errorMsg . "\n", FILE_APPEND);

        return false;
    }
}

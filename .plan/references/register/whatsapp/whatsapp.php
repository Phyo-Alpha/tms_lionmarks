<?php

require_once __DIR__ . '/../../conf/conf.php';
function sendWhatsappMessage($countryCode, $to)
{
    // Extract just the country code number (e.g., "+65" from "SG +65")
    $codeParts = explode(' ', $countryCode);
    $code = isset($codeParts[1]) ? $codeParts[1] : $countryCode;
    // Remove + if present and add it back
    $code = '+' . ltrim($code, '+');
    $recipient = str_replace('+', '', $code) . $to;
    error_log("Sending WhatsApp message to " . $recipient);

    $access_token = WHATSAPP_ACCESS_TOKEN;
    $url = WHATSAPP_URL;

    $body = array(
        "messaging_product" => "whatsapp",
        "to" => $recipient,
        "type" => "template",
        "template" => array(
            "name" => WHATSAPP_TEMPLATE_NAME,
            "language" => array(
                "code" => WHATSAPP_TEMPLATE_LANGUAGE
            )
        )
    );

    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/json",
            "Authorization: Bearer $access_token"
        ),
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
    ));

    $response = curl_exec($ch);
    $error = curl_error($ch);

    curl_close($ch);

    if ($error) {
        error_log("Whatsapp API Error: " . $error);
        return false;
    }

    $result = json_decode($response, true);

    // Check if there's an error in the response
    if (isset($result['error'])) {
        $errorMessage = isset($result['error']['message']) ? $result['error']['message'] : json_encode($result['error']);
        error_log("Whatsapp API Error: " . $errorMessage);
        return false;
    }

    // Check if message was sent successfully (should have 'messages' array with message ID)
    if (!isset($result['messages'])) {
        error_log("Whatsapp API Error: Unexpected response format - " . json_encode($result));
        return false;
    }

    error_log("WhatsApp message sent successfully to " . $recipient);
    return true;
}

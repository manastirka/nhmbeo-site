<?php
/**
 * Newsletter signup for the static Hostinger export.
 * Accepts JSON or form POST, sends mail to the museum, returns JSON.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

// Honeypot — bots fill this; humans never see it.
$honeypot = trim((string) ($data['company'] ?? $data['website'] ?? ''));
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$email = strtolower(trim((string) ($data['email'] ?? '')));
$name = trim((string) ($data['name'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_email']);
    exit;
}

if (strlen($name) > 120) {
    $name = substr($name, 0, 120);
}

$to = getenv('NEWSLETTER_TO') ?: 'nhmbeo@nhmbeo.rs';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$from = getenv('NEWSLETTER_FROM') ?: ('noreply@' . preg_replace('/:\d+$/', '', $host));

$subject = 'Newsletter signup — nhmbeo site';
$safeName = $name !== '' ? $name : '(no name)';
$body = "New newsletter signup\n\nName: {$safeName}\nEmail: {$email}\nWhen: " . gmdate('c') . "\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $from,
    'Reply-To: ' . $email,
];

$ok = @mail($to, $subject, $body, implode("\r\n", $headers));
if (!$ok) {
    http_response_code(500);
    echo json_encode(['error' => 'mail_failed']);
    exit;
}

echo json_encode(['ok' => true]);

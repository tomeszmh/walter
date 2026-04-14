<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

$missing = [];
foreach ([
    'mail-config.php'   => __DIR__ . '/mail-config.php',
    'src/Exception.php' => __DIR__ . '/src/Exception.php',
    'src/PHPMailer.php' => __DIR__ . '/src/PHPMailer.php',
    'src/SMTP.php'      => __DIR__ . '/src/SMTP.php',
] as $label => $path) {
    if (!file_exists($path)) $missing[] = $label;
}
if (!empty($missing)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Hiányzó fájlok: ' . implode(', ', $missing)]);
    exit;
}

require_once __DIR__ . '/mail-config.php';
require_once __DIR__ . '/src/Exception.php';
require_once __DIR__ . '/src/PHPMailer.php';
require_once __DIR__ . '/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Rate-limit: max 5 küldés / IP / óra
session_start();
$now = time();
if (!isset($_SESSION['mail_log'])) $_SESSION['mail_log'] = [];
$_SESSION['mail_log'] = array_filter($_SESSION['mail_log'], fn($t) => $now - $t < 3600);
if (count($_SESSION['mail_log']) >= 5) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'rate_limit']);
    exit;
}

function sanitize(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$name      = sanitize($_POST['name']      ?? '');
$email     = sanitize($_POST['email']     ?? '');
$phone     = sanitize($_POST['phone']     ?? '');
$service   = sanitize($_POST['service']   ?? '');
$message   = sanitize($_POST['message']   ?? '');
$note      = sanitize($_POST['note']      ?? '');
$form_type = sanitize($_POST['form_type'] ?? 'contact');

// Validáció
if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A név megadása kötelező.']);
    exit;
}
if ($form_type === 'contact') {
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Érvényes email cím megadása kötelező.']);
        exit;
    }
    if (empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Az üzenet megadása kötelező.']);
        exit;
    }
}
if ($form_type === 'quote' && empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A telefonszám megadása kötelező.']);
    exit;
}

// Routing: melyik szolgáltatás → melyik emailcím
$routing = [
    'klima-telepites'          => 'beuzemeles@waltergepeszet.hu',
    'hoszivattyu-telepites'    => 'beuzemeles@waltergepeszet.hu',
    'vrv'                      => 'beuzemeles@waltergepeszet.hu',
    'ngbs'                     => 'beuzemeles@waltergepeszet.hu',
    'gepeszet'                 => 'beuzemeles@waltergepeszet.hu',
    'klima-karbantartas'       => 'karbantartas@waltergepeszet.hu',
    'hoszivattyu-karbantartas' => 'karbantartas@waltergepeszet.hu',
    'klima-szerviz'            => 'szerviz@waltergepeszet.hu',
    'hoszivattyu-szerviz'      => 'szerviz@waltergepeszet.hu',
];

$to = $routing[$service] ?? 'info@waltergepeszet.hu';

$service_labels = [
    'klima-telepites'          => 'Klíma telepítése / beüzemelése',
    'klima-karbantartas'       => 'Klíma karbantartás',
    'klima-szerviz'            => 'Klíma szerviz / javítás',
    'hoszivattyu-telepites'    => 'Hőszivattyú telepítése / beüzemelése',
    'hoszivattyu-karbantartas' => 'Hőszivattyú karbantartás',
    'hoszivattyu-szerviz'      => 'Hőszivattyú szerviz / javítás',
    'vrv'                      => 'VRV klíma telepítése',
    'ngbs'                     => 'Helyiségenkénti vezérlés (NGBS)',
    'gepeszet'                 => 'Gépészeti / villamos szerelés',
    'egyeb'                    => 'Egyéb',
];

$service_label = $service_labels[$service] ?? 'Nincs megadva';
$subject_prefix = ($form_type === 'quote') ? 'Visszahívás kérés' : 'Üzenet';

// Email törzs
$date_str = date('Y-m-d H:i');
$ip       = $_SERVER['REMOTE_ADDR'] ?? '—';

if ($form_type === 'contact') {
    $body  = "Új üzenet érkezett a Walter & Walter Kft. weboldaláról.\n\n";
    $body .= "Név:                {$name}\n";
    $body .= "Email:              {$email}\n";
    $body .= "Telefon:            " . ($phone ?: '—') . "\n";
    $body .= "Érdeklődés tárgya:  {$service_label}\n\n";
    $body .= "Üzenet:\n{$message}\n\n";
    $body .= str_repeat('-', 40) . "\n";
    $body .= "Elküldve: {$date_str}  |  IP: {$ip}\n";
} else {
    $body  = "Visszahívás kérés érkezett a Walter & Walter Kft. weboldaláról.\n\n";
    $body .= "Név:                {$name}\n";
    $body .= "Telefon:            {$phone}\n";
    $body .= "Érdeklődés tárgya:  {$service_label}\n";
    if (!empty($note)) {
        $body .= "\nMegjegyzés:\n{$note}\n";
    }
    $body .= "\n" . str_repeat('-', 40) . "\n";
    $body .= "Elküldve: {$date_str}  |  IP: {$ip}\n";
}

// PHPMailer küldés SMTP-n
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = MAIL_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_USERNAME;
    $mail->Password   = MAIL_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // port 465 = SSL
    $mail->Port       = MAIL_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress($to);

    // Reply-To: ha van email a feladónak, arra válaszoljon
    if ($form_type === 'contact' && !empty($email)) {
        $mail->addReplyTo($email, $name);
    }

    $mail->Subject = "{$subject_prefix} — {$service_label} — {$name}";
    $mail->Body    = $body;
    $mail->isHTML(false);

    $mail->send();

    $_SESSION['mail_log'][] = $now;
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $mail->ErrorInfo]);
}

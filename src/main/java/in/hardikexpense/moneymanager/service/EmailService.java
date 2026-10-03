package in.hardikexpense.moneymanager.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
@Slf4j
public class EmailService {

    private static final URI BREVO_EMAIL_URI = URI.create("https://api.brevo.com/v3/smtp/email");

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    @Value("${brevo.api-key:}")
    private String apiKey;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    @Value("${brevo.sender-name:Money Manager}")
    private String senderName;

    public void sendEmail(String to, String subject, String body) {
        send(to, subject, body, false);
    }

    public void sendHtmlEmail(String to, String subject, String body) {
        send(to, subject, body, true);
    }

    private void send(String to, String subject, String body, boolean html) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "BREVO_API_KEY is empty. Render free web services block SMTP ports 25, 465, and 587, so mail has to go through the Brevo HTTPS API.");
        }
        String contentField = html ? "htmlContent" : "textContent";
        String payload = "{"
                + "\"sender\":{\"name\":" + json(senderName) + ",\"email\":" + json(fromEmail) + "},"
                + "\"to\":[{\"email\":" + json(to) + "}],"
                + "\"subject\":" + json(subject) + ","
                + "\"" + contentField + "\":" + json(body)
                + "}";
        try {
            log.info("Sending email via Brevo API to {}", to);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(BREVO_EMAIL_URI)
                    .timeout(Duration.ofSeconds(10))
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .header("api-key", apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int status = response.statusCode();
            if (status < 200 || status >= 300) {
                log.error("Brevo API rejected email to {} with status {} body {}", to, status, response.body());
                throw new IllegalStateException("Brevo API status " + status + ": " + response.body());
            }
            log.info("Brevo API accepted email to {} with status {}", to, status);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Brevo API call failed for {}", to, e);
            throw new RuntimeException("Failed to send email via Brevo API: " + e.getMessage(), e);
        }
    }

    private static String json(String value) {
        if (value == null) {
            return "null";
        }
        StringBuilder escaped = new StringBuilder(value.length() + 16);
        escaped.append('"');
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"' -> escaped.append("\\\"");
                case '\\' -> escaped.append("\\\\");
                case '\n' -> escaped.append("\\n");
                case '\r' -> escaped.append("\\r");
                case '\t' -> escaped.append("\\t");
                default -> {
                    if (c < 0x20) {
                        escaped.append(String.format("\\u%04x", (int) c));
                    } else {
                        escaped.append(c);
                    }
                }
            }
        }
        escaped.append('"');
        return escaped.toString();
    }
}

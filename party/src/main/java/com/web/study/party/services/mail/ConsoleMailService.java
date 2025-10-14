package com.web.study.party.services.mail;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class ConsoleMailService implements MailService {

    private final JavaMailSender mailSender;
    private final MailProps props;

    @Override
    public void send(String to, String subject, String html) {
        if (!props.isEnabled()) {
            log.info("[MAIL-DISABLED] to={} subject={} html={}", to, subject, html);
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            // multipart=true để support HTML + inline content
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(props.getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true); // true = HTML
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Send mail failed: to={}, subject={}, err={}", to, subject, e.toString());
            // tuỳ m: có thể ném RuntimeException để BE báo lỗi
            throw new IllegalStateException("Không gửi được email, thử lại sau.");
        }
    }

    @Override
    public void sendOtp(String to, String purpose, String otp, int ttlSeconds) {
        String subject = "[Study Party] " + purpose;
        // Tách logic tính toán ra khỏi template cho rõ ràng
        int ttlMinutes = Math.max(1, ttlSeconds / 60);

        // Dùng placeholder %s (string) và %d (số nguyên)
        String htmlTemplate = """
                <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                  <h2 style="color: #333;">%s</h2>
                  <p>Mã OTP của bạn là:</p>
                  <div style="background-color: #f5f5f5; border-radius: 4px; padding: 10px 15px; text-align: center;">
                    <span style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #1a1a1a;">%s</span>
                  </div>
                  <p>Mã sẽ hết hạn sau <b>%d phút</b>.</p>
                  <p>Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
                  <hr style="border: none; border-top: 1px solid #eee;"/>
                  <p style="color: #888; font-size: 12px;">Study Party • Đây là email tự động, vui lòng không trả lời.</p>
                </div>
                """;
        // Dùng String.format để điền các giá trị vào template
        String html = String.format(htmlTemplate, purpose, otp, ttlMinutes);
        send(to, subject, html);
    }

    @Override
    public void sendInvitation(String to, String inviterName, String groupName, String invitationLink) {
        String subject = "[Study Party] " + inviterName + " đã mời bạn tham gia nhóm học!";

        String htmlTemplate = """
                <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                  <h2 style="color: #333;">Bạn có lời mời tham gia nhóm!</h2>
                  <p>Chào bạn,</p>
                  <p><b>%s</b> đã mời bạn tham gia vào nhóm học <b>"%s"</b> trên Study Party.</p>
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="%s" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      Chấp nhận lời mời
                    </a>
                  </div>
                  <p>Nếu nút trên không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
                  <p style="word-break: break-all; font-size: 12px;"><a href="%s">%s</a></p>
                  <p>Lưu ý: Lời mời có thể có thời hạn.</p>
                  <hr style="border: none; border-top: 1px solid #eee;"/>
                  <p style="color: #888; font-size: 12px;">Study Party • Đây là email tự động, vui lòng không trả lời.</p>
                </div>
                """;

        String html = String.format(htmlTemplate, inviterName, groupName, invitationLink, invitationLink, invitationLink);
        send(to, subject, html);
    }
}

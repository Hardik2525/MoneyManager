package in.hardikexpense.moneymanager.service;


import in.hardikexpense.moneymanager.entity.ProfileEntity;
import in.hardikexpense.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontEndUrl;


    @Scheduled(cron = "0 * * * * *", zone = "IST")
    //@Scheduled(cron = "0 0 22 * * *", zone = "IST")
    public void sendDailyIncomeExpenseReminder(){
        log.info("Job started: sendDailyIncomeExpenseReminder");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for(ProfileEntity profile : profiles){
            String updateUrl = frontEndUrl;
            String body = String.format(
                    "<html><body style=\"font-family: Arial, sans-serif; color: #333;\">" +
                    "<p>Hi %s,</p>" +
                    "<p>This is a friendly reminder to add your income and expenses for today in Money Manager.</p>" +
                    "<p><a href=\"%s\" style=\"display: inline-block; padding: 10px 20px; " +
                    "background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;\">" +
                    "Update Income and Expense</a></p>" +
                    "<p><br><br>Best regards,<br>Money Manager Team</p>" +
                    "</body></html>",
                    HtmlUtils.htmlEscape(profile.getFullName()),
                    HtmlUtils.htmlEscape(updateUrl)
            );
            emailService.sendHtmlEmail(profile.getEmail(), "Friendly Reminder to Update Daily Income and Expense", body);
        }
    }

}

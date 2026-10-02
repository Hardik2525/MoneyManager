package in.hardikexpense.moneymanager.service;


import in.hardikexpense.moneymanager.dto.ExpenseDTO;
import in.hardikexpense.moneymanager.entity.ProfileEntity;
import in.hardikexpense.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDate;
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


    //@Scheduled(cron = "0 * * * * *", zone = "IST")
    @Scheduled(cron = "0 0 22 * * *", zone = "IST")
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
            emailService.sendEmail(profile.getEmail(), "Friendly Reminder to Update Daily Income and Expense", body);
        }
        log.info("Job completed : sendDailyIncomeExpenseReminder()");
    }

    //@Scheduled(cron = "0 0 23 * * *", zone = "IST")
    @Scheduled(cron = "0 * * * * *", zone = "IST")
    public void sendDailyExpenseSummary(){
        log.info("Job started: sendDailyExpenseSummary()");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for(ProfileEntity profile : profiles){
            List<ExpenseDTO> todaysExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now());
            if(!todaysExpenses.isEmpty()){
                StringBuilder table = new StringBuilder();
                table.append("<table style='border-collapse: collapse; width: 100%;'>");
                table.append("<tr><th style='border: 1px solid #ddd; padding: 8px;'>Category</th><th style='border: 1px solid #ddd; padding: 8px;'>Amount</th></tr>");
                for(ExpenseDTO expense : todaysExpenses){
                    table.append("<tr><td style='border: 1px solid #ddd; padding: 8px;'>").append(expense.getCategoryName()).append("</td><td style='border: 1px solid #ddd; padding: 8px;'>").append(expense.getAmount()).append("</td></tr>");
                }
                table.append("</table>");
                String body = String.format(
                    "<html><body style=\"font-family: Arial, sans-serif; color: #333;\">" +
                    "<p>Hi %s,</p>" +
                    "<p>This is a summary of your expenses for today:</p>" +
                    "<p>%s</p>" +
                    "<p><br><br>Best regards,<br>Money Manager Team</p>" +
                    "</body></html>",
                    HtmlUtils.htmlEscape(profile.getFullName()),
                    HtmlUtils.htmlEscape(table.toString())
                );
                emailService.sendEmail(profile.getEmail(), "Daily Expense Summary", body);
            }
        }
    }

}

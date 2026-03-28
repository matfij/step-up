using System.Net.Mail;
using Resend;

namespace StepUpServer.Common;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string htmlContent);
}

public class EmailService(IConfiguration configuration, IResend resend) : IEmailService
{
    private readonly string _fromAddress = configuration["Email:FromAddress"]!;
    private readonly string _fromName = configuration["Email:FromName"]!;

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        await resend.EmailSendAsync(new EmailMessage()
        {
            From = $"{_fromName} <{_fromAddress}>",
            To = to,
            Subject = subject,
            HtmlBody = htmlBody,
        });
    }
}

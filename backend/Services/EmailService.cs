using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Vaquita.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<EmailService> logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            this.configuration = configuration;
            this.logger = logger;
        }

        public async Task Enviar(string para, string asunto, string html)
        {
            var host = configuration["Smtp:Host"];

            // Sin SMTP configurado: se muestra el mail en la consola (modo desarrollo)
            if (string.IsNullOrWhiteSpace(host))
            {
                logger.LogWarning("📧 MAIL (no enviado, SMTP sin configurar)\nPara: {Para}\nAsunto: {Asunto}\n{Html}", para, asunto, html);
                return;
            }

            var mensaje = new MimeMessage();
            mensaje.From.Add(MailboxAddress.Parse(configuration["Smtp:From"]));
            mensaje.To.Add(MailboxAddress.Parse(para));
            mensaje.Subject = asunto;
            mensaje.Body = new TextPart("html") { Text = html };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(host, int.Parse(configuration["Smtp:Port"] ?? "587"), SecureSocketOptions.StartTls);

            if (!string.IsNullOrWhiteSpace(configuration["Smtp:User"]))
                await smtp.AuthenticateAsync(configuration["Smtp:User"], configuration["Smtp:Password"]);

            await smtp.SendAsync(mensaje);
            await smtp.DisconnectAsync(true);
        }
    }
}
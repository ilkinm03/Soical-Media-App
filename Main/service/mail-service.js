require("dotenv").config();
const nodemailer = require("nodemailer");

const ApiError = require("../exceptions/api.error");
const logger = require("../logger/logger");

class MailService {
  async sendResetPasswordMail(to, link) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailHTML = `
    <body bgcolor="#f5f5f5" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" offset="0" style="padding:70px 0 70px 0;">
      <table width="600" height="auto" align="center" cellpadding="0" cellspacing="0" style="background-color:#fdfdfd; border:1px solid #dcdcdc; border-radius:3px !important;">
        <tr>
          <td width="600" height="auto" bgcolor="#000" border="0" style="padding:36px 48px; display:block; margin: 0px auto;">
            <h1 style="color:#ffffff; font-family:&quot; Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif; font-size:30px; line-height:150%; font-weight:300; margin:0; text-align:left;">Reset Password</h1>
          </td>
        </tr>
        <tr>
          <td width="600" bgcolor="#fdfdfd" border="0" style="color:#737373; font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif; font-size:14px; line-height:150%; text-align:left; padding:48px;">
            <p style="margin:0 0 16px;">Reset your password: <br/>Email address: <b>${to}</b></p>
            <p style="margin:0 0 16px;">Here is your reset password link: <b>${link}</b></p>
          </td>
        </tr>
        <tr>
          <td width="600" border="0" style="padding:0 48px 48px 48px; color:#707070; font-family:Arial; font-size:12px; line-height:125%; text-align:center;">
            <p>&copy; 2022 Social Media App</p>
          </td>
        </tr>
      </table>
    </body>`;

    const mailerOptions = {
      from: `"Social Media App" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Social Media App",
      text: "Reset your social media app password",
      html: mailHTML,
    };

    transporter.sendMail(mailerOptions, (error) => {
      if(error) {
        logger.warn("MailService.sendResetPasswordMail -- cannot send");
        throw ApiError.ServiceUnavailableException("Cannot send!");
      }
    });

    logger.debug("MailService.sendResetPasswordMail -- SUCCESS");
  }
}

module.exports = new MailService();

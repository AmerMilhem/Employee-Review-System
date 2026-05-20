import { Router } from "express";
import nodemailer from "nodemailer";

const emailRouter = Router();

function buildHtmlEmail(data: Record<string, unknown>): string {
  const emp = (data.employeeInfo as Record<string, string>) || {};
  const scores = (data.scores as Record<string, number>) || {};
  const comments = (data.comments as Record<string, string>) || {};
  const totalScore = typeof data.totalScore === "number" ? data.totalScore.toFixed(1) : "0.0";
  const breakdown = Array.isArray(data.breakdown) ? data.breakdown : [];

  const scoreColor =
    Number(totalScore) >= 85
      ? "#16a34a"
      : Number(totalScore) >= 70
        ? "#059669"
        : Number(totalScore) >= 50
          ? "#d97706"
          : "#dc2626";

  const rowsHtml = breakdown
    .map((b: Record<string, unknown>) => {
      const pct =
        (b.rawAvg as number) > 0
          ? (((b.weightedScore as number) / (b.weight as number)) * 100).toFixed(0)
          : "—";
      return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 14px; font-family: Cairo, Tajawal, Arial, sans-serif; font-size: 14px;">${b.title}</td>
        <td style="padding: 10px 14px; text-align: center; font-size: 13px; color: #6b7280;">${b.weight}%</td>
        <td style="padding: 10px 14px; text-align: center; font-weight: 700; color: ${scoreColor};">${pct}%</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <title>تقرير تقييم الأداء السنوي</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Cairo,Tajawal,Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#166534,#15803d);padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:rgba(255,255,255,0.75);font-size:12px;font-family:Cairo,Arial,sans-serif;">نظام الموارد البشرية</p>
                  <h1 style="margin:4px 0 0;color:#ffffff;font-size:22px;font-weight:800;font-family:Cairo,Arial,sans-serif;">تقرير تقييم الأداء السنوي</h1>
                </td>
                <td align="left" style="color:rgba(255,255,255,0.85);font-size:13px;font-family:Cairo,Arial,sans-serif;">
                  سنة ${emp.year || new Date().getFullYear()}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Total Score -->
        <tr>
          <td style="padding:24px 32px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:13px;color:#6b7280;font-family:Cairo,Arial,sans-serif;">النتيجة الإجمالية</p>
                  <p style="margin:4px 0 0;font-size:38px;font-weight:900;color:${scoreColor};font-family:Cairo,Arial,sans-serif;">${totalScore}%</p>
                </td>
                <td align="left">
                  <table cellpadding="0" cellspacing="0">
                    <tr><td style="padding:3px 0;font-size:13px;color:#374151;font-family:Cairo,Arial,sans-serif;"><strong>الموظف:</strong> ${emp.name || "—"}</td></tr>
                    <tr><td style="padding:3px 0;font-size:13px;color:#374151;font-family:Cairo,Arial,sans-serif;"><strong>القسم:</strong> ${emp.department || "—"}</td></tr>
                    <tr><td style="padding:3px 0;font-size:13px;color:#374151;font-family:Cairo,Arial,sans-serif;"><strong>المسمى:</strong> ${emp.jobTitle || "—"}</td></tr>
                    <tr><td style="padding:3px 0;font-size:13px;color:#374151;font-family:Cairo,Arial,sans-serif;"><strong>المقيِّم:</strong> ${emp.evaluatorName || "—"}</td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Breakdown table -->
        <tr>
          <td style="padding:24px 32px;">
            <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#111827;font-family:Cairo,Arial,sans-serif;">توزيع الدرجات حسب المحور</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:10px 14px;text-align:right;font-size:13px;color:#374151;font-weight:700;font-family:Cairo,Arial,sans-serif;">المحور</th>
                  <th style="padding:10px 14px;text-align:center;font-size:13px;color:#374151;font-weight:700;font-family:Cairo,Arial,sans-serif;">الوزن</th>
                  <th style="padding:10px 14px;text-align:center;font-size:13px;color:#374151;font-weight:700;font-family:Cairo,Arial,sans-serif;">النتيجة</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </td>
        </tr>

        <!-- Comments -->
        ${
          comments.strengths || comments.weaknesses || comments.recommendations
            ? `<tr>
          <td style="padding:0 32px 24px;">
            <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#111827;font-family:Cairo,Arial,sans-serif;">التعليقات والتوصيات</h2>
            ${
              comments.strengths
                ? `<div style="margin-bottom:12px;padding:14px;background:#f0fdf4;border-right:4px solid #16a34a;border-radius:8px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#16a34a;font-family:Cairo,Arial,sans-serif;">نقاط القوة والإنجازات</p>
                <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;font-family:Cairo,Arial,sans-serif;">${comments.strengths}</p>
              </div>`
                : ""
            }
            ${
              comments.weaknesses
                ? `<div style="margin-bottom:12px;padding:14px;background:#fff7ed;border-right:4px solid #ea580c;border-radius:8px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#ea580c;font-family:Cairo,Arial,sans-serif;">نقاط الضعف ومجالات التحسين</p>
                <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;font-family:Cairo,Arial,sans-serif;">${comments.weaknesses}</p>
              </div>`
                : ""
            }
            ${
              comments.recommendations
                ? `<div style="padding:14px;background:#fffbeb;border-right:4px solid #d97706;border-radius:8px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#d97706;font-family:Cairo,Arial,sans-serif;">توصيات المدير</p>
                <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;font-family:Cairo,Arial,sans-serif;">${comments.recommendations}</p>
              </div>`
                : ""
            }
          </td>
        </tr>`
            : ""
        }

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;font-family:Cairo,Arial,sans-serif;">
              تم إنشاء هذا التقرير تلقائياً من نظام تقييم الأداء السنوي
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

emailRouter.post("/send-evaluation", async (req, res) => {
  const { recipientEmail, employeeInfo, scores, comments, totalScore, breakdown } = req.body as {
    recipientEmail: string;
    employeeInfo: Record<string, string>;
    scores: Record<string, number>;
    comments: Record<string, string>;
    totalScore: number;
    breakdown: Record<string, unknown>[];
  };

  if (!recipientEmail) {
    res.status(400).json({ error: "recipientEmail is required" });
    return;
  }

  const emailUser = process.env["EMAIL_USER"];
  const emailPass = process.env["EMAIL_APP_PASSWORD"];

  if (!emailUser || !emailPass) {
    res.status(500).json({
      error: "Email credentials not configured. Please set EMAIL_USER and EMAIL_APP_PASSWORD.",
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass },
  });

  const empName = employeeInfo?.name || "موظف";
  const year = employeeInfo?.year || new Date().getFullYear();
  const html = buildHtmlEmail({ employeeInfo, scores, comments, totalScore, breakdown });

  try {
    await transporter.sendMail({
      from: `"نظام تقييم الأداء" <${emailUser}>`,
      to: recipientEmail,
      subject: `تقرير تقييم الأداء السنوي — ${empName} — ${year}`,
      html,
    });

    req.log.info({ recipientEmail }, "Evaluation email sent");
    res.json({ success: true, message: "تم إرسال التقرير بنجاح" });
  } catch (err) {
    req.log.error({ err }, "Failed to send email");
    res.status(500).json({ error: "فشل إرسال الإيميل. تحقق من إعدادات البريد الإلكتروني." });
  }
});

export default emailRouter;

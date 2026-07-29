"use server";

import {
  EMPTY_CONTACT_INQUIRY,
  buildInquiryHtml,
  buildInquirySubject,
  buildInquiryText,
  contactValidationError,
  inquiryReplyTo,
  parseContactForm,
  resolveInquiryRecipient,
  type ContactFormState,
} from "@/lib/contactInquiry";
import { contactMailFrom, contactMailTo, createResendClient } from "@/lib/resend";

const SEND_FAILED_MESSAGE =
  "메일 발송에 실패했습니다. 잠시 후 다시 시도하시거나 전화로 문의해 주세요.";

// 성공 시에는 빈 값을 돌려준다. 폼은 이 값을 defaultValue로 쓰므로 그대로 비워진다.
const SENT_STATE: ContactFormState = {
  status: "sent",
  message: "",
  field: "",
  values: EMPTY_CONTACT_INQUIRY,
};

export async function sendContactInquiry(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = parseContactForm(formData);
  const agreed = formData.get("agree") === "on";

  const invalid = contactValidationError(values, agreed);
  if (invalid) {
    return { status: "error", message: invalid.message, field: invalid.field, values };
  }

  // 허니팟: 사람에게는 보이지 않는 입력이 채워졌다면 봇이므로 조용히 성공 처리한다.
  if (typeof formData.get("website") === "string" && formData.get("website") !== "") {
    return SENT_STATE;
  }

  const resend = createResendClient();
  const from = contactMailFrom();
  if (!resend || !from) {
    console.error("[contact] RESEND_API_KEY 또는 CONTACT_MAIL_FROM이 설정되지 않았습니다.");
    return { status: "error", message: SEND_FAILED_MESSAGE, field: "", values };
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: resolveInquiryRecipient(contactMailTo()),
      replyTo: [...inquiryReplyTo(values)],
      subject: buildInquirySubject(values),
      text: buildInquiryText(values),
      html: buildInquiryHtml(values),
    });
    if (error) {
      console.error("[contact] Resend 발송 실패:", error);
      return { status: "error", message: SEND_FAILED_MESSAGE, field: "", values };
    }
  } catch (error) {
    console.error("[contact] Resend 호출 중 오류:", error);
    return { status: "error", message: SEND_FAILED_MESSAGE, field: "", values };
  }

  return SENT_STATE;
}

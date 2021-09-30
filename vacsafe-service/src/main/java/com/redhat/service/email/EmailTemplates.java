package com.redhat.service.email;

import java.util.HashMap;
import java.util.Map;

import com.redhat.service.model.MessageBuilder;
import com.redhat.service.model.Message;

public class EmailTemplates {

    public static final String NEGATIVE_RESULT = "NEGATIVE_RESULT";
    public static final String NEGATIVE_RESULT_REMINDER = "NEGATIVE_RESULT_REMINDER";
    public static final String POSITIVE_RESULT_HR = "POSITIVE_RESULT_HR";
    public static final String POSITIVE_RESULT = "POSITIVE_RESULT";
    public static final String POSITIVE_RESULT_REMINDER = "POSITIVE_RESULT_REMINDER";
    public static final String INCONCLUSIVE_RESULT = "INCONCLUSIVE_RESULT";
    public static final String VACCINE_PARTIAL = "VACCINE_PARTIAL";
    public static final String VACCINE_UNDER_REVIEW = "VACCINE_UNDER_REVIEW";
    public static final String VACCINE_ACCEPTED = "VACCINE_ACCEPTED";
    public static final String VACCINE_DECLINED = "VACCINE_DECLINED";

    public static final Message NEGATIVE_RESULT_MSG = new MessageBuilder()
        .id(NEGATIVE_RESULT)
        .subject("COVID Test Result Received")
        .text("Thank you for providing your negative COVID-19 test result. Per Executive Order and OSHR Policy, all workers are required to provide proof of fully vaccinated status or complete weekly COVID-19 testing, submit COVID-19 test results and wear a face covering. If testing weekly, please provide COVID-19 test results within 7 days after your previous test.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see  OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();

    // 4 Calendar Days after the date of the Test
    public static final Message NEGATIVE_RESULT_REMINDER_MSG = new MessageBuilder()
        .id(NEGATIVE_RESULT_REMINDER)
        .subject("COVID-19 Testing Reminder")
        .text("Per Executive Order and OSHR policy, all workers are required to provide proof of fully vaccinated status or complete weekly COVID-19 testing and submit results. If testing weekly, please provide test results as soon as received, and no later than 7 days after your previous test.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();

    public static final Message POSITIVE_RESULT_HR_MSG = new MessageBuilder()
        .id(POSITIVE_RESULT_HR)
        .subject("COVID Positive Test Result Received")
        .text("Please note a positive COVID-19 test result has been submitted. Check the COVIDSafeNC system for more information and contact the employee immediately to provide appropriate guidance. Also, ensure you confirm the notification in the Priority Inbox once action has been taken.")
        .build();

    public static final Message POSITIVE_RESULT_MSG = new MessageBuilder()
        .id(POSITIVE_RESULT)
        .subject("COVID Positive Test Result Received")
        .text("Thank you for providing your positive test result. This is confirmation of receipt of your submission. Please contact Human Resources immediately for additional guidance.")
        .build();

    // 86 Calendar Days after the date of the Test
    public static final Message POSITIVE_RESULT_REMINDER_MSG = new MessageBuilder()
        .id(POSITIVE_RESULT_REMINDER)
        .subject("COVID-19 Testing Reminder")
        .text("It has been 86 days since you tested positive for COVID-19, as you indicated in COVIDSafeNC. You are nearing the 90-day requirement after testing positive for COVID-19 to commence testing if not fully vaccinated. Per Executive Order and OSHR policy, all workers are required to provide proof of fully vaccinated status or complete weekly COVID-19 testing and submit results. If testing weekly, please provide test results as soon as received, and no later than 7 days after your previous test.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();

    public static final Message INCONCLUSIVE_RESULT_MSG = new MessageBuilder()
        .id(INCONCLUSIVE_RESULT)
        .subject("COVID Test Result Received")
        .text("Thank you for providing your COVID-19 test result. The result was inconclusive. You need to immediately get another test and submit a positive or negative COVID-19 test result. Per OSHR policy, all workers are required to provide proof of fully vaccinated status or provide a negative test result each week. Your agency may allow you to report onsite while you are waiting for a new, conclusive test result. Please contact HR immediately to discuss. You must wear a face covering if you report to work.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();


    public static final Message VACCINE_PARTIAL_MSG = new MessageBuilder()
        .id(VACCINE_PARTIAL)
        .subject("COVID Vaccine Information Received")
        .text("Thank you for submitting proof of receiving one of two doses of a two-dose COVID vaccine (AstraZeneca, Pfizer, Moderna, or Novavax). Per CDC guidelines, you are not fully vaccinated until 14 days after you have received both doses. Once you have received both doses and 14 days have passed, please resubmit information that confirms you are fully vaccinated. NOTE: Until it has been at least 14 days after the final dose you will need to complete weekly COVID-19 testing. Continue to wear a face covering when working onsite.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();

    public static final Message VACCINE_UNDER_REVIEW_MSG = new MessageBuilder()
        .id(VACCINE_UNDER_REVIEW)
        .subject("COVID Vaccination Information Received")
        .text("Thank you for your submission. Your proof of vaccination is pending HR review. Regardless of your agency's face covering requirement, please continue to wear a face covering onsite while HR is reviewing your submission and until you have been notified by HR that your proof of vaccination has been accepted.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();

    public static final Message VACCINE_ACCEPTED_MSG = new MessageBuilder()
        .id(VACCINE_ACCEPTED)
        .subject("COVID Proof of Vaccination Accepted")
        .text("Thank you for your submission. Your proof of vaccination has been accepted. No additional COVID-19 testing or information is required at this time.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();

    public static final Message VACCINE_DECLINED_MSG = new MessageBuilder()
        .id(VACCINE_DECLINED)
        .subject("COVID Proof of Vaccination Declined")
        .text("Thank you for your submission. Your proof of fully vaccinated status has been declined due to the reason listed below.")
        .hasParams(true)
        .appendText("\n\n")
        .appendText("%s")
        .appendText("\n\n")
        .appendText("Please resubmit proof of being fully vaccinated for review, complete weekly testing requirements and wear a face covering until your fully vaccinated status is approved by Human Resources.")
        .appendText("\n\n")
        .appendText("If you have any questions or need assistance please see OSHR's FAQ page at https://oshr.redhat.com/vaccination-or-testing-policy-FAQs or contact your Human Resources representative.")
        .build();

    
    private static final Map<String, Message> cache = new HashMap<>();
    static {
        cache.put(NEGATIVE_RESULT_MSG.getId(), NEGATIVE_RESULT_MSG);
        cache.put(NEGATIVE_RESULT_REMINDER_MSG.getId(), NEGATIVE_RESULT_REMINDER_MSG);
        cache.put(POSITIVE_RESULT_HR_MSG.getId(), POSITIVE_RESULT_HR_MSG);
        cache.put(POSITIVE_RESULT_MSG.getId(), POSITIVE_RESULT_MSG);
        cache.put(POSITIVE_RESULT_REMINDER_MSG.getId(), POSITIVE_RESULT_REMINDER_MSG);
        cache.put(INCONCLUSIVE_RESULT_MSG.getId(), INCONCLUSIVE_RESULT_MSG);
        cache.put(VACCINE_PARTIAL_MSG.getId(), VACCINE_PARTIAL_MSG);
        cache.put(VACCINE_UNDER_REVIEW_MSG.getId(), VACCINE_UNDER_REVIEW_MSG);
        cache.put(VACCINE_ACCEPTED_MSG.getId(), VACCINE_ACCEPTED_MSG);
        cache.put(VACCINE_DECLINED_MSG.getId(), VACCINE_DECLINED_MSG);
    }

    public static Message get(String key) {
        return cache.get(key);
    }

}

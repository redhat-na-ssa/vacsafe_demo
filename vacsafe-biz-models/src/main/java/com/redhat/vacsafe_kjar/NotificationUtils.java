package com.redhat.vacsafe_kjar;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.redhat.vax.model.CovidTestResultDocument;
import com.redhat.vax.model.Document;
import com.redhat.vax.model.Employee;
import com.redhat.vax.model.Utils;

public class NotificationUtils {

    private static final ZoneId defaultZoneId = ZoneId.systemDefault();

    private static final String environment = System.getProperty("covidsafe.environment", "uat");

    public static String getEmployeeEmails(Employee employee) {
        if(employee == null)
          throw new RuntimeException("getEmployeeEmails() employee can not be null");

        Set<String> s = new HashSet<>();
        if(!Utils.isBlank(employee.getEmail())){
            s.add(employee.getEmail());
        }
        if(!Utils.isBlank(employee.getAlternateEmail())){
            s.add(employee.getAlternateEmail());
        }
        return s.stream().collect(Collectors.joining(","));
    }

    public static String getHrMailingList(Document document) {
        if(document == null) {
            throw new RuntimeException("Document is null");
        }
        if(document.getEmployee() == null) {
            throw new RuntimeException("Document.getEmployee() is null");
        }
        return getHrMailingList(document.getEmployee().getAgencyName());
    }

    public static String getHrMailingList(String agencyName) {
        String mailingList = null;
        if("production".equalsIgnoreCase(environment)) {
            mailingList = hrMailingListMap.get(normalize(agencyName));
            return mailingList;
        } else if("uat".equalsIgnoreCase(environment)) {
            mailingList = hrMailingListUatMap.get(normalize(agencyName));
            return mailingList;
        } else {
            mailingList = hrMailingListDevMap.get(normalize(agencyName));
            return mailingList;
        }
    }

    public static Date daysAfter(LocalDate date, long daysToAdd) {
        return Date.from(date.plusDays(daysToAdd).atStartOfDay(defaultZoneId).toInstant());
    }

    public static Date daysAfterTestDate(CovidTestResultDocument document, long daysToAdd) {
        return daysAfter(document.getCovidTestDate(), daysToAdd);
    }

    private static final Map<String, String> hrMailingListMap = new HashMap<>();
    static {
        hrMailingListMap.put(normalize("Department of Administration"), "doa.hr.vax@doa.nc.gov");
        hrMailingListMap.put(normalize("Department of Commerce"), "Commerce_Vaccination_Approvers@nccommerce.com");
        hrMailingListMap.put(normalize("Department of Cultural Resources"), "human.resources@ncdcr.gov");
        hrMailingListMap.put(normalize("Department of Environment and Natural Resources"), "DEQHR_Vax@ncdenr.gov");
        hrMailingListMap.put(normalize("Department of Military and Veterans Affairs"), "OSHRDHR@nc.gov");
        hrMailingListMap.put(normalize("Department of Public Safety"), "COVIDSafe@ncdps.gov");
        hrMailingListMap.put(normalize("Department of Revenue"), "Humanresources@ncdor.gov");
        hrMailingListMap.put(normalize("Department of Transportation"), "oshrc19notifications@ncdot.gov");
        hrMailingListMap.put(normalize("DHHS - Department of Health and Human Services"), "DHHS.HR.COVID.Notifications@dhhs.nc.gov");
        hrMailingListMap.put(normalize("Industrial Commission"), null);
        hrMailingListMap.put(normalize("Office of Information Technology Services"), "DIT_HR_Vax@nc.gov");
        hrMailingListMap.put(normalize("Office of State Budget and Management"), "OSHRDHR@nc.gov");
        hrMailingListMap.put(normalize("Office of State Human Resources"), "OSHRDHR@nc.gov");
        hrMailingListMap.put(normalize("Office of the Governor"), "OSHRDHR@nc.gov");
        hrMailingListMap.put(normalize("Office of the Lt. Governor"), null);
        hrMailingListMap.put(normalize("Public Staff Utilities Commission"), null);
        hrMailingListMap.put(normalize("State Board of Elections"), "Electors-HR@ncsbe.gov");
        hrMailingListMap.put(normalize("Utilities Commission"), null);
        hrMailingListMap.put(normalize("North Carolina School of Science and Mathematics"), null);
        hrMailingListMap.put(normalize("Wildlife Resources Commission"), null);
        hrMailingListMap.put(normalize("Community College System"), null);
    }

    private static final Map<String, String> hrMailingListUatMap = new HashMap<>();
    static {
        hrMailingListUatMap.put(normalize("Department of Administration"), "glenn.poplawski@nc.gov");
        hrMailingListUatMap.put(normalize("Department of Commerce"), null);
        hrMailingListUatMap.put(normalize("Department of Cultural Resources"), null);
        hrMailingListUatMap.put(normalize("Department of Environment and Natural Resources"), "Shailaja.mallur@nc.gov");
        hrMailingListUatMap.put(normalize("Department of Military and Veterans Affairs"), null);
        hrMailingListUatMap.put(normalize("Department of Public Safety"), null);
        hrMailingListUatMap.put(normalize("Department of Revenue"), null);
        hrMailingListUatMap.put(normalize("Department of Transportation"), null);
        hrMailingListUatMap.put(normalize("DHHS - Department of Health and Human Services"), null);
        hrMailingListUatMap.put(normalize("Industrial Commission"), null);
        hrMailingListUatMap.put(normalize("Office of Information Technology Services"), "christina.martin@nc.gov");
        hrMailingListUatMap.put(normalize("Office of State Budget and Management"), null);
        hrMailingListUatMap.put(normalize("Office of State Human Resources"), "Anita.ward@nc.gov");
        hrMailingListUatMap.put(normalize("Office of the Governor"), null);
        hrMailingListUatMap.put(normalize("Office of the Lt. Governor"), null);
        hrMailingListUatMap.put(normalize("Public Staff Utilities Commission"), null);
        hrMailingListUatMap.put(normalize("State Board of Elections"), null);
        hrMailingListUatMap.put(normalize("Utilities Commission"), null);
        hrMailingListUatMap.put(normalize("North Carolina School of Science and Mathematics"), null);
        hrMailingListUatMap.put(normalize("Wildlife Resources Commission"), null);
        hrMailingListUatMap.put(normalize("Community College System"), null);
    }

    private static final Map<String, String> hrMailingListDevMap = new HashMap<>();
    static {
        hrMailingListDevMap.put(normalize("Office of Information Technology Services"), "ssidimah@redhat.com");
    }

    private static String normalize(String s) {
        return s!= null ? s.toUpperCase() : null;
    }

}


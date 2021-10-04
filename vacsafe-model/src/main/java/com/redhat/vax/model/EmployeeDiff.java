package com.redhat.vax.model;

public class EmployeeDiff {

    private final boolean agencyCodeChanged;
    private final boolean agencyNameChanged;
    private final boolean divisionCodeChanged;
    private final boolean divisionNameChanged;
    private final boolean emailChanged;
    private final boolean firstNameChanged;
    // private final boolean fullTimePartTimeChanged;
    private final boolean isHrChanged;
    private final boolean lastNameChanged;
    // private final boolean middleNameChanged;
    // private final boolean ncidChanged;
    private final boolean supervisorChanged;
    // private final boolean usernameChanged;
    // private final boolean userTypeChanged;


    public EmployeeDiff(Employee e1, Employee e2) {
        agencyCodeChanged   = ! same(e1.getAgencyCode(), e2.getAgencyCode());
        agencyNameChanged   = ! same(e1.getAgencyName(), e2.getAgencyName()); 
        divisionCodeChanged = ! same(e1.getDivisionCode(), e2.getDivisionCode());
        divisionNameChanged = ! same(e1.getDivisionName(), e2.getDivisionName());
        emailChanged        = ! same(e1.getEmail(), e2.getEmail());
        firstNameChanged    = ! same(e1.getFirstName(), e2.getFirstName());
        isHrChanged         = ! same(e1.isHR(), e2.isHR());
        lastNameChanged     = ! same(e1.getLastName(), e2.getLastName());
        // middleNameChanged   = ! same(e1.getMiddleName(), e2.getMiddleName());
        // ncidChanged         = ! same(e1.getNcid(), e2.getNcid());
        supervisorChanged   = ! same(e1.getSupervisor(), e2.getSupervisor());
        // usernameChanged     = ! same(e1.getUsername(), e2.getUsername());
        // userTypeChanged     = ! same(e1.getUserType(), e2.getUserType());
        // fullTimePartTimeChanged = ! same(e1.getFullTimePartTime(), e2.getFullTimePartTime());
    }

    public boolean ldapFieldChanged() {
        return agencyCodeChanged ||
            agencyNameChanged ||
            divisionCodeChanged ||
            divisionNameChanged ||
            emailChanged ||
            isHrChanged ||
            // fullTimePartTimeChanged ||
            firstNameChanged ||
            lastNameChanged ||
            // middleNameChanged ||
            // ncidChanged ||
            // usernameChanged ||
            // userTypeChanged ||
            supervisorChanged;
    }

    public boolean isAgencyCodeChanged() {
        return agencyCodeChanged;
    }

    public boolean isAgencyNameChanged() {
        return agencyNameChanged;
    }

    public boolean isDivisionCodeChanged() {
        return divisionCodeChanged;
    }

    public boolean isDivisionNameChanged() {
        return divisionNameChanged;
    }

    public boolean isEmailChanged() {
        return emailChanged;
    }

    public boolean isFirstNameChanged() {
        return firstNameChanged;
    }

    // public boolean isFullTimePartTimeChanged() {
    //     return fullTimePartTimeChanged;
    // }

    public boolean isHrChanged() {
        return isHrChanged;
    }

    public boolean isLastNameChanged() {
        return lastNameChanged;
    }

    // public boolean isMiddleNameChanged() {
    //     return middleNameChanged;
    // }

    // public boolean isNcidChanged() {
    //     return ncidChanged;
    // }

    public boolean isSupervisorChanged() {
        return supervisorChanged;
    }

    // public boolean isUsernameChanged() {
    //     return usernameChanged;
    // }

    // public boolean isUserTypeChanged() {
    //     return userTypeChanged;
    // }

    private boolean same(String s1, String s2) {
        return (s1 == null && s2 == null) || (s1 != null && s1.equals(s2));
    }

    private boolean same(boolean b1, boolean b2) {
        return b1 == b2;
    }

}

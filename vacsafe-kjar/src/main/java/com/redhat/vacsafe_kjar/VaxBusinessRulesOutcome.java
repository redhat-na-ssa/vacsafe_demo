package com.redhat.vacsafe_kjar;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class VaxBusinessRulesOutcome implements Serializable {

    private boolean fullyVaccinated = false;
    private LocalDate fullVaccinatedDate;
    private List<String> issueList = new ArrayList<>();

    public void addIssue(String issue) {
        this.issueList.add(issue);
    }

    public boolean hasIssues() {
        return !hasNoIssues();
    }

    public boolean hasNoIssues() {
        return issueList.isEmpty();
    }

    public boolean isFullyVaccinated() {
        return getFullyVaccinated();
    }

    public boolean getFullyVaccinated() {
        return fullyVaccinated;
    }

    public void setFullyVaccinated(boolean fullyVaccinated) {
        this.fullyVaccinated = fullyVaccinated;
    }

    public LocalDate getFullVaccinatedDate() {
        return fullVaccinatedDate;
    }

    public void setFullVaccinatedDate(LocalDate fullVaccinatedDate) {
        this.fullVaccinatedDate = fullVaccinatedDate;
    }

    public List<String> getIssueList() {
        return issueList;
    }

    public void setIssueList(List<String> issueList) {
        this.issueList = issueList;
    }

    @Override
    public String toString() {
        return "VaxBusinessRulesOutcome [fullVaccinatedDate=" + fullVaccinatedDate + ", fullyVaccinated="
                + fullyVaccinated + ", issueList=" + issueList + "]";
    }

}

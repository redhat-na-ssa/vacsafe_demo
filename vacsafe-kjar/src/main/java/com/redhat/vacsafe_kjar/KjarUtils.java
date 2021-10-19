package com.redhat.vacsafe_kjar;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import com.redhat.vax.model.VaccineBrand;
import com.redhat.vax.model.VaccineCardDocument;

public class KjarUtils {

    public static boolean nonBlank(String s) {
        return s != null && !s.trim().isEmpty();
    }

    public static boolean partialVaccineSubmission(VaccineCardDocument document) {
        if(document == null) {
            throw new IllegalArgumentException("document is null");
        }

        VaccineBrand brand = document.getVaccineBrand();
        int shotNumber = document.getVaccineShotNumber();

        return partialVaccineSubmission(brand, shotNumber);
    }

    public static boolean partialVaccineSubmission(VaccineBrand brand, int shotNumber) {
        
        boolean multiShotVaccine = 
            brand == VaccineBrand.PFIZER ||
            brand == VaccineBrand.MODERNA ||
            brand == VaccineBrand.ASTRAZENECA || 
            brand == VaccineBrand.NOVAVAX;

        return multiShotVaccine && shotNumber == 1;
    }

    public static long numberOfDaysElapsed(LocalDate date){
        return ChronoUnit.DAYS.between(date, today());
    }

    public static LocalDate today() {
        return LocalDate.now();
    }

}

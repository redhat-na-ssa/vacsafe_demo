package com.redhat.vacsafe_kjar;

import static org.junit.Assert.assertEquals;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.junit.Test;

import com.redhat.vax.model.VaccineBrand;

public class KjarUtilsTest {

    @Test
    public void partialSubmissionTest() {
        Map<VaccineBrand, Integer> full = new HashMap<>();
        full.put(VaccineBrand.JOHNSON, -1);
        full.put(VaccineBrand.JANSSEN, -1);
        full.put(VaccineBrand.PFIZER, 2);
        full.put(VaccineBrand.MODERNA, 2);
        full.put(VaccineBrand.ASTRAZENECA, 2);
        full.put(VaccineBrand.NOVAVAX, 2);

        Map<VaccineBrand, Integer> partial = new HashMap<>();
        partial.put(VaccineBrand.PFIZER, 1);
        partial.put(VaccineBrand.MODERNA, 1);
        partial.put(VaccineBrand.ASTRAZENECA, 1);
        partial.put(VaccineBrand.NOVAVAX, 1);


        for(Entry<VaccineBrand, Integer> e: full.entrySet()) {
            assertEquals(
                e.getKey() +" shot " + e.getValue(), 
                false, 
                KjarUtils.partialVaccineSubmission(e.getKey(), e.getValue()));
        }

        for(Entry<VaccineBrand, Integer> e: partial.entrySet()) {
            assertEquals(
                e.getKey() +" shot " + e.getValue(), 
                true, 
                KjarUtils.partialVaccineSubmission(e.getKey(), e.getValue()));
        }
    }

    @Test
    public void numberOfDaysElapsedTest() {
        assertEquals(10, KjarUtils.numberOfDaysElapsed(LocalDate.now().minusDays(10)));
        assertEquals(-10, KjarUtils.numberOfDaysElapsed(LocalDate.now().plusDays(10)));
    }
}

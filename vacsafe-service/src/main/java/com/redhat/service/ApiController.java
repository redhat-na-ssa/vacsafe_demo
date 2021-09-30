package com.redhat.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redhat.vax.model.Employee;

@RestController
@RequestMapping("/api")
public class ApiController {

    private static final Logger log = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private CustomQueryService queryService;

    @Autowired
    KeycloackAuthUtil authUtil;

    @PostMapping("employee")
    public ResponseEntity<String> saveEmployee(Authentication authentication, @RequestBody Employee employee) {

        if(!authUtil.hasApiRole(authentication)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if(employee == null) {
            log.debug(">>> Employee is null");
            return ResponseEntity.badRequest().build();
        }

        if(employee.getId() == null || employee.getId().trim().isEmpty()) {
            log.debug(">>> Employee id is missing");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Employee id is missing");
        }

        queryService.persistOrOverwriteEmployee(employee);
        return ResponseEntity.ok().build();
    }

}

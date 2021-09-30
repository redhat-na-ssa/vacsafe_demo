package com.redhat.service;

import java.util.Set;

import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class KeycloackAuthUtil {

    private static final Logger log = LoggerFactory.getLogger(KeycloackAuthUtil.class);

    @Value("${com.redhat.agency.role.prefix}")
    private String AGENCY_ROLE_PREFIX;

    @Value("${com.redhat.api.role.name:api-user}")
    private String API_ROLE;

    public String getUser(Authentication authentication) {
        if(authentication == null) {
            throw new RuntimeException("User in unauthenticated");
        }

        String user = ((KeycloakAuthenticationToken) authentication).getName();
        log.info(">>> User: {}", user);
        return user;
    }

    public Set<String> getRealmRoles(Authentication authentication) {
        AccessToken token = getAccessToken(authentication);
        return getRealmRoles(token);
    }

    public Set<String> getRealmRoles(AccessToken token) {
        AccessToken.Access access = token.getRealmAccess();
        Set<String> roles = access.getRoles();
        log.info(">>> Realm Roles: {}", roles);
        return roles;
    }

    public AccessToken getAccessToken(Authentication authentication) {
        if(authentication == null) {
            throw new RuntimeException("User in unauthenticated");
        }

        return ((KeycloakSecurityContext) ((KeycloakAuthenticationToken) authentication).getCredentials()).getToken();
    }

    // private String clientId = "vacsafenc-pam-temp" ;//FIXME
    // private Set<String> getRessourceRoles(AccessToken token) {
    //     AccessToken.Access access = token.getResourceAccess(clientId);
    //     Set<String> roles = access.getRoles();
    //     return roles;
    // }

    private String getAgencyName(Set<String> roles) {
        for(String role: roles) {
            if(role.startsWith(AGENCY_ROLE_PREFIX)) {
                return role.substring(AGENCY_ROLE_PREFIX.length());
            } 
        }
        return null;
    }

    public String getAgencyName(Authentication authentication) {
        Set<String> roles = getRealmRoles(authentication);
        String agency = getAgencyName(roles);
        log.debug(">>> Realm roles from token: {}", roles);
        log.debug(">>> Agency name extracted from token: {}.  Role prefix: {}", agency, AGENCY_ROLE_PREFIX);
        return agency;
    }

    public boolean hasApiRole(Authentication authentication) {
        Set<String> roles = getRealmRoles(authentication);
        return roles.contains(API_ROLE);
    }

}

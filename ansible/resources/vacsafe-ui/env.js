// blank values are replaced at runtime by the set-config.js node script
(function(window) {
  window._env = window._env || {};

  window._env.KEYCLOAK_URL = "{{ sso_url }}";
  window._env.SSO_REALM = "{{ sso_realm_id }}";
  window._env.SSO_CLIENT = "{{ sso_clientId }}";
  window._env.KIE_SERVER_URL = "https://{{ vacsafe_service_hostname }}";
  window._env.KIE_SERVER_USERID = "kieserver";
  window._env.KIE_SERVER_PASSWORD = "{{ vacsafe_service_api_passwd }}";
  window._env.DM_CONTAINER_ALIAS = "";
  window._env.PAM_CONTAINER_ALIAS = "{{ vacsafe_service_deployment_name }}-{{ vacsafe_service_deployment_version }}";
  window._env.PROCESS_ID = "{{ vacsafe_test_result_submittion_process_id }}";

  window._env.IS_OPENSHIFT = "true";
})(this);

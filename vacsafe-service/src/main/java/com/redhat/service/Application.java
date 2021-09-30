package com.redhat.service;

import javax.persistence.EntityManagerFactory;

import org.drools.persistence.jpa.marshaller.JPAPlaceholderResolverStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.MapPropertySource;


@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        //SpringApplication.run(Application.class, args);
        SpringApplication springApplication = new SpringApplication(Application.class);
        springApplication.addListeners(new SystemPropertiesSetterEventListener());
        springApplication.run(args);
    }

    @Bean
    public S3Service s3Service() {
        return new S3Service();
    }

    @Bean(name = "JPAPlaceholderResolverStrategy")
    public JPAPlaceholderResolverStrategy jpaMarshaller(EntityManagerFactory emf) {
        return new JPAPlaceholderResolverStrategy(emf);
    }

    private static class SystemPropertiesSetterEventListener
            implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {
        
        @Override
        public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        event.getEnvironment().getPropertySources().forEach(ps -> {
            if (ps instanceof MapPropertySource) {
                MapPropertySource mps = (MapPropertySource) ps;
                mps.getSource().forEach((key, value) -> {
                    if("vacsafe.environment".equals(key) ||
                       "vacsafe.email.enable".equals(key)  
                    ) {
                        System.getProperties().putIfAbsent(key, value.toString());
                    }
                });
            }
        });
        }
    }
}

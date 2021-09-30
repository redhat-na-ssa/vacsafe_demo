package com.redhat.service;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class SpringContextConfig implements ApplicationContextAware {

    private static ApplicationContext context;
    
    /**
     * Returns the Spring managed bean instance of the given class type if it exists.
     * Returns null otherwise.
     * @param beanClass
     * @return
     */
    public static <T extends Object> T getBean(Class<T> beanClass) {
        return context.getBean(beanClass);
    }
     
    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        SpringContextConfig.context = context;
    } 
}

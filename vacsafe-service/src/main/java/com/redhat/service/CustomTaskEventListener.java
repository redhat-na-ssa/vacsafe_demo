package com.redhat.service;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.kie.api.task.TaskEvent;
import org.kie.api.task.TaskLifeCycleEventListener;
import org.kie.api.task.model.OrganizationalEntity;
import org.kie.api.task.model.TaskData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.redhat.vax.model.Document;
import com.redhat.vax.model.DocumentTaskMapping;

@Component
public class CustomTaskEventListener implements TaskLifeCycleEventListener {

    private static final Logger log = LoggerFactory.getLogger(CustomTaskEventListener.class);

    private final String DOCUMENT_KEY = "document";

    @PersistenceContext
    EntityManager em;

    @Transactional
    private void saveMapping(TaskEvent event) {
        
        Long taskId = event.getTask().getId();
        TaskData taskData = event.getTask().getTaskData();

        if( taskData != null 
                && taskData.getTaskInputVariables() != null 
                && taskData.getTaskInputVariables().containsKey(DOCUMENT_KEY)) {
            
            long pid = taskData.getProcessInstanceId();
            Document document = (Document) taskData.getTaskInputVariables().get(DOCUMENT_KEY);
            long documentId = document.getId();

            DocumentTaskMapping mapping = new DocumentTaskMapping();
            mapping.setDocumentId(documentId);
            mapping.setTaskId(taskId);
            mapping.setProcessInstanceId(pid);
            
            em.persist(mapping);
            log.debug(">>> Persisting {}", mapping);
        }
    }

    @Override
    public void afterTaskActivatedEvent(TaskEvent event) {}

    @Override
    public void afterTaskAddedEvent(TaskEvent event) {
        log.info(">>> After task added. {}", event);
        saveMapping(event);
    }

    @Override
    public void afterTaskAssignmentsAddedEvent(TaskEvent event, AssignmentType type,
            List<OrganizationalEntity> entities) {}

    @Override
    public void afterTaskAssignmentsRemovedEvent(TaskEvent event, AssignmentType type,
            List<OrganizationalEntity> entities) {}

    @Override
    public void afterTaskClaimedEvent(TaskEvent event) {}

    @Override
    public void afterTaskCompletedEvent(TaskEvent event) {}

    @Override
    public void afterTaskDelegatedEvent(TaskEvent event) {}

    @Override
    public void afterTaskExitedEvent(TaskEvent event) {}

    @Override
    public void afterTaskFailedEvent(TaskEvent event) {}

    @Override
    public void afterTaskForwardedEvent(TaskEvent event) {}

    @Override
    public void afterTaskInputVariableChangedEvent(TaskEvent event, Map<String, Object> variables) {}

    @Override
    public void afterTaskNominatedEvent(TaskEvent event) {}

    @Override
    public void afterTaskNotificationEvent(TaskEvent event) {}

    @Override
    public void afterTaskOutputVariableChangedEvent(TaskEvent event, Map<String, Object> variables) {}

    @Override
    public void afterTaskReassignedEvent(TaskEvent event) {}

    @Override
    public void afterTaskReleasedEvent(TaskEvent event) {}

    @Override
    public void afterTaskResumedEvent(TaskEvent event) {}

    @Override
    public void afterTaskSkippedEvent(TaskEvent event) {}

    @Override
    public void afterTaskStartedEvent(TaskEvent event) {}

    @Override
    public void afterTaskStoppedEvent(TaskEvent event) {}

    @Override
    public void afterTaskSuspendedEvent(TaskEvent event) {}

    @Override
    public void afterTaskUpdatedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskActivatedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskAddedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskAssignmentsAddedEvent(TaskEvent event, AssignmentType type,
            List<OrganizationalEntity> entities) {}

    @Override
    public void beforeTaskAssignmentsRemovedEvent(TaskEvent event, AssignmentType type,
            List<OrganizationalEntity> entities) {}

    @Override
    public void beforeTaskClaimedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskCompletedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskDelegatedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskExitedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskFailedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskForwardedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskInputVariableChangedEvent(TaskEvent event, Map<String, Object> variables) {}

    @Override
    public void beforeTaskNominatedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskNotificationEvent(TaskEvent event) {}

    @Override
    public void beforeTaskOutputVariableChangedEvent(TaskEvent event, Map<String, Object> variables) {}

    @Override
    public void beforeTaskReassignedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskReleasedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskResumedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskSkippedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskStartedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskStoppedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskSuspendedEvent(TaskEvent event) {}

    @Override
    public void beforeTaskUpdatedEvent(TaskEvent event) {}
    
}

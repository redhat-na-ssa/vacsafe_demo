// package gov.nc.vax.model;

// import java.io.Serializable;
// import java.time.LocalDateTime;

// import javax.persistence.Column;
// import javax.persistence.Entity;
// import javax.persistence.GeneratedValue;
// import javax.persistence.Id;
// import javax.persistence.SequenceGenerator;
// import javax.persistence.Table;

// @Entity
// @Table( name = "cs_employee_status_log")
// public class EmployeeStatusLog implements Serializable {

//     static final long serialVersionUID = 1L;

//     @Id
//     @GeneratedValue(generator = "EMPLOYEE_STATUS_LOG_ID_GENERATOR", strategy = javax.persistence.GenerationType.AUTO)
//     @SequenceGenerator(name = "EMPLOYEE_STATUS_LOG_ID_GENERATOR", sequenceName = "EMPLOYEE_STATUS_LOG_ID_SEQ", allocationSize = 1)
//     protected Long id;
    
//     @Column(name = "previous_status")
//     private EmployeeStatus previousStatus;

//     @Column(name = "current_status")
//     private EmployeeStatus currentStatus;

//     private LocalDateTime timestamp = LocalDateTime.now();

//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public EmployeeStatus getPreviousStatus() {
//         return previousStatus;
//     }

//     public void setPreviousStatus(EmployeeStatus previousStatus) {
//         this.previousStatus = previousStatus;
//     }

//     public EmployeeStatus getCurrentStatus() {
//         return currentStatus;
//     }

//     public void setCurrentStatus(EmployeeStatus currentStatus) {
//         this.currentStatus = currentStatus;
//     }

//     public LocalDateTime getTimestamp() {
//         return timestamp;
//     }

//     @Override
//     public String toString() {
//         return "EmployeeStatusLog [id=" + id + ", currentStatus=" + currentStatus + ", previousStatus=" + previousStatus
//                 + ", timestamp=" + timestamp + "]";
//     }
// }

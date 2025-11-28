export interface EmployeeData {
  id: number;
  name: string;
  job_title: string;
  department_id: [number, string] | false;
  work_email: string;
  work_phone: string | false;
  private_email: string | false;
  private_phone: string | false;
  mobile_phone: string | false;
  image_url: string;
  
  // Approval status
  approval_state: "draft" | "submitted" | "approved" | "reject" | false;
  reject_reason: string | false;
  
  // Address and location
  address_id: [number, string] | false;
  work_location_id: [number, string] | false;
  work_location_plan_id: [number, string] | false;
  private_street: string | false;
  
  // Manager roles
  is_manager: boolean;
  attendance_manager_id: [number, string] | false;
  expense_manager_id: [number, string] | false;
  timesheet_manager_id: [number, string] | false;
  
  // Personal info
  marital: string;
  children: number;
  certificate: string;
  lang: string;
  tz: string;
  emergency_contact: string | false;
  emergency_phone: string | false;
  
  // Education
  study_field: string | false;
  study_school: string | false;
  
  // Work schedule
  resource_calendar_id: [number, string] | false;
  
  // Banking
  bank_account_id: [number, string] | false;
  
  // Private Contact additional fields
  km_home_work: string | false;
  private_car_plate: string | false;
  
  // Job details
  job_description: string | false;
  planning_role_ids: any[];
  
  // Attachments and messages
  attachments: Attachment[];
  messages: any[];
  
  model: string;
}

export interface Attachment {
  id: number;
  url: string;
  mimetype: string;
  create_date: string;
  name: string;
}

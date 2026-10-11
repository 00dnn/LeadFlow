/**
 * LeadFlow - Core Constants
 * Centralized enumeration and configuration values across the application.
 */

export const UserRoles = Object.freeze({
  SETTER: 'Appointment Setter',
  CLOSER: 'Closer'
});

export const LeadStatus = Object.freeze({
  PENDING: 'Pending',
  CONTACTED: 'Contacted',
  INTERESTED: 'Interested',
  FOLLOW_UP_REQUIRED: 'Follow-up Required',
  NO_ANSWER: 'No Answer',
  WON: 'Won',
  LOST: 'Lost'
});

export const LeadStatusConfig = Object.freeze({
  [LeadStatus.PENDING]: {
    label: 'Pending',
    badgeClass: 'badge-pending',
    icon: 'hourglass-split',
    description: 'Lead created and awaiting initial closer outreach'
  },
  [LeadStatus.CONTACTED]: {
    label: 'Contacted',
    badgeClass: 'badge-contacted',
    icon: 'telephone-outbound',
    description: 'Initial contact made with customer'
  },
  [LeadStatus.INTERESTED]: {
    label: 'Interested',
    badgeClass: 'badge-interested',
    icon: 'star-fill',
    description: 'Customer showed genuine interest in the solution'
  },
  [LeadStatus.FOLLOW_UP_REQUIRED]: {
    label: 'Follow-up Required',
    badgeClass: 'badge-follow-up',
    icon: 'calendar-event',
    description: 'Customer requested a follow-up conversation'
  },
  [LeadStatus.NO_ANSWER]: {
    label: 'No Answer',
    badgeClass: 'badge-no-answer',
    icon: 'telephone-x',
    description: 'Customer did not answer call/outreach'
  },
  [LeadStatus.WON]: {
    label: 'Won',
    badgeClass: 'badge-won',
    icon: 'check-circle-fill',
    description: 'Deal successfully closed and signed'
  },
  [LeadStatus.LOST]: {
    label: 'Lost',
    badgeClass: 'badge-lost',
    icon: 'x-circle-fill',
    description: 'Customer declined or was disqualified'
  }
});

export const ServiceOptions = Object.freeze([
  'Enterprise Cloud Migration',
  'Custom CRM Integration',
  'Cybersecurity Audit & Compliance',
  'AI Workflow Automation',
  'Managed IT & DevOps Services',
  'Data Analytics & BI Platform'
]);

export const StorageKeys = Object.freeze({
  LEADS: 'leadflow_leads_data',
  ACTIVE_USER_ID: 'leadflow_active_user_id',
  INITIALIZED: 'leadflow_app_initialized'
});

export const Events = Object.freeze({
  USER_CHANGED: 'user:changed',
  LEAD_CREATED: 'lead:created',
  LEAD_UPDATED: 'lead:updated',
  FILTER_CHANGED: 'filter:changed',
  NOTIFICATION_SHOW: 'notification:show'
});

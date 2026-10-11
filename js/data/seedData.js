/**
 * LeadFlow - Seed Data
 * Initial realistic appointments and audit history for demonstration and testing.
 */

import { LeadStatus } from '../core/Constants.js';

export const initialSeedLeads = [
  {
    id: 'LF-104921',
    customerName: 'Marcus Sterling',
    phoneNumber: '415-555-0142',
    email: 'm.sterling@apexcloud.io',
    serviceInterest: 'Enterprise Cloud Migration',
    appointmentDate: '2026-10-15',
    appointmentTime: '10:00',
    setterId: 'setter-1',
    closerId: 'closer-1',
    status: LeadStatus.WON,
    notes: [
      'Initial appointment qualified for 500-seat multi-cloud AWS migration.',
      'Customer was very impressed with SLA guarantees and enterprise pricing.',
      'Signed master services agreement and scheduled onboarding kick-off.'
    ],
    history: [
      {
        id: 'hist-101',
        timestamp: '2026-10-09T09:30:00.000Z',
        userId: 'setter-1',
        userName: 'Sarah Jenkins',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Customer contacted via inbound web demo request. Qualified budget of $80k.',
        actionType: 'created'
      },
      {
        id: 'hist-102',
        timestamp: '2026-10-10T14:15:00.000Z',
        userId: 'closer-1',
        userName: 'Alex Rivera',
        userRole: 'Closer',
        fromStatus: LeadStatus.PENDING,
        toStatus: LeadStatus.INTERESTED,
        note: 'Customer was very impressed with SLA guarantees and enterprise pricing.',
        actionType: 'status_update'
      },
      {
        id: 'hist-103',
        timestamp: '2026-10-11T11:00:00.000Z',
        userId: 'closer-1',
        userName: 'Alex Rivera',
        userRole: 'Closer',
        fromStatus: LeadStatus.INTERESTED,
        toStatus: LeadStatus.WON,
        note: 'Signed master services agreement and scheduled onboarding kick-off.',
        actionType: 'status_update'
      }
    ],
    createdAt: '2026-10-09T09:30:00.000Z',
    updatedAt: '2026-10-11T11:00:00.000Z'
  },
  {
    id: 'LF-104922',
    customerName: 'Danielle Chen',
    phoneNumber: '312-555-0891',
    email: 'dchen@vanguardfin.com',
    serviceInterest: 'Custom CRM Integration',
    appointmentDate: '2026-10-16',
    appointmentTime: '14:30',
    setterId: 'setter-1',
    closerId: 'closer-1',
    status: LeadStatus.FOLLOW_UP_REQUIRED,
    notes: [
      'Replacing legacy spreadsheets with custom HubSpot & Salesforce sync.',
      'Discovery call completed. CTO needs to review the security architecture before final approval.'
    ],
    history: [
      {
        id: 'hist-201',
        timestamp: '2026-10-10T10:15:00.000Z',
        userId: 'setter-1',
        userName: 'Sarah Jenkins',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Qualified lead from financial webinar. Looking to integrate CRM across 4 offices.',
        actionType: 'created'
      },
      {
        id: 'hist-202',
        timestamp: '2026-10-11T15:20:00.000Z',
        userId: 'closer-1',
        userName: 'Alex Rivera',
        userRole: 'Closer',
        fromStatus: LeadStatus.PENDING,
        toStatus: LeadStatus.FOLLOW_UP_REQUIRED,
        note: 'Discovery call completed. CTO needs to review the security architecture before final approval.',
        actionType: 'status_update'
      }
    ],
    createdAt: '2026-10-10T10:15:00.000Z',
    updatedAt: '2026-10-11T15:20:00.000Z'
  },
  {
    id: 'LF-104923',
    customerName: 'Robert Langston',
    phoneNumber: '512-555-4321',
    email: 'rlangston@biotechgroup.org',
    serviceInterest: 'AI Workflow Automation',
    appointmentDate: '2026-10-17',
    appointmentTime: '11:15',
    setterId: 'setter-1',
    closerId: 'closer-2',
    status: LeadStatus.CONTACTED,
    notes: [
      'Seeking to automate lab report ingestion and parsing.',
      'Brief introductory call made. Scheduled follow-up live demo next week.'
    ],
    history: [
      {
        id: 'hist-301',
        timestamp: '2026-10-10T13:45:00.000Z',
        userId: 'setter-1',
        userName: 'Sarah Jenkins',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Inbound referral from regional bio-conference.',
        actionType: 'created'
      },
      {
        id: 'hist-302',
        timestamp: '2026-10-11T09:00:00.000Z',
        userId: 'closer-2',
        userName: 'Elena Rostova',
        userRole: 'Closer',
        fromStatus: LeadStatus.PENDING,
        toStatus: LeadStatus.CONTACTED,
        note: 'Brief introductory call made. Scheduled follow-up live demo next week.',
        actionType: 'status_update'
      }
    ],
    createdAt: '2026-10-10T13:45:00.000Z',
    updatedAt: '2026-10-11T09:00:00.000Z'
  },
  {
    id: 'LF-104924',
    customerName: 'Amara Okafor',
    phoneNumber: '206-555-7734',
    email: 'aokafor@skywardlogistics.com',
    serviceInterest: 'Cybersecurity Audit & Compliance',
    appointmentDate: '2026-10-18',
    appointmentTime: '09:00',
    setterId: 'setter-1',
    closerId: 'closer-1',
    status: LeadStatus.PENDING,
    notes: [
      'Requires SOC2 and ISO27001 readiness review ahead of Q1 audit.'
    ],
    history: [
      {
        id: 'hist-401',
        timestamp: '2026-10-11T08:00:00.000Z',
        userId: 'setter-1',
        userName: 'Sarah Jenkins',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Initial qualification call. Immediate urgent timeline for upcoming compliance deadline.',
        actionType: 'created'
      }
    ],
    createdAt: '2026-10-11T08:00:00.000Z',
    updatedAt: '2026-10-11T08:00:00.000Z'
  },
  {
    id: 'LF-104925',
    customerName: 'Harrison Forde',
    phoneNumber: '617-555-9081',
    email: 'hforde@medialab.io',
    serviceInterest: 'Data Analytics & BI Platform',
    appointmentDate: '2026-10-19',
    appointmentTime: '13:00',
    setterId: 'setter-2',
    closerId: 'closer-2',
    status: LeadStatus.INTERESTED,
    notes: [
      'Wants executive KPI dashboards combining Stripe and Google Analytics.',
      'Very interested in the Snowflake + PowerBI reference architecture.'
    ],
    history: [
      {
        id: 'hist-501',
        timestamp: '2026-10-08T11:20:00.000Z',
        userId: 'setter-2',
        userName: 'Marcus Vance',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Connected via LinkedIn outreach. High engagement.',
        actionType: 'created'
      },
      {
        id: 'hist-502',
        timestamp: '2026-10-09T16:45:00.000Z',
        userId: 'closer-2',
        userName: 'Elena Rostova',
        userRole: 'Closer',
        fromStatus: LeadStatus.PENDING,
        toStatus: LeadStatus.INTERESTED,
        note: 'Very interested in the Snowflake + PowerBI reference architecture.',
        actionType: 'status_update'
      }
    ],
    createdAt: '2026-10-08T11:20:00.000Z',
    updatedAt: '2026-10-09T16:45:00.000Z'
  },
  {
    id: 'LF-104926',
    customerName: 'Grace Holloway',
    phoneNumber: '720-555-2283',
    email: 'gholloway@summitmfg.net',
    serviceInterest: 'Managed IT & DevOps Services',
    appointmentDate: '2026-10-20',
    appointmentTime: '15:45',
    setterId: 'setter-2',
    closerId: 'closer-1',
    status: LeadStatus.NO_ANSWER,
    notes: [
      'Factory floor automation monitoring needs 24/7 DevOps coverage.',
      'Attempted scheduled phone appointment at 3:45 PM. Left detailed voicemail and follow-up email.'
    ],
    history: [
      {
        id: 'hist-601',
        timestamp: '2026-10-07T14:00:00.000Z',
        userId: 'setter-2',
        userName: 'Marcus Vance',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Booked from direct marketing campaign.',
        actionType: 'created'
      },
      {
        id: 'hist-602',
        timestamp: '2026-10-10T16:00:00.000Z',
        userId: 'closer-1',
        userName: 'Alex Rivera',
        userRole: 'Closer',
        fromStatus: LeadStatus.PENDING,
        toStatus: LeadStatus.NO_ANSWER,
        note: 'Attempted scheduled phone appointment at 3:45 PM. Left detailed voicemail and follow-up email.',
        actionType: 'status_update'
      }
    ],
    createdAt: '2026-10-07T14:00:00.000Z',
    updatedAt: '2026-10-10T16:00:00.000Z'
  },
  {
    id: 'LF-104927',
    customerName: 'Thomas Albright',
    phoneNumber: '404-555-6619',
    email: 'talbright@retailgroup.com',
    serviceInterest: 'Custom CRM Integration',
    appointmentDate: '2026-10-21',
    appointmentTime: '11:00',
    setterId: 'setter-2',
    closerId: 'closer-2',
    status: LeadStatus.LOST,
    notes: [
      'Customer decided to freeze IT spending until next fiscal year. Budget reallocation.'
    ],
    history: [
      {
        id: 'hist-701',
        timestamp: '2026-10-06T15:30:00.000Z',
        userId: 'setter-2',
        userName: 'Marcus Vance',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Inbound demo request.',
        actionType: 'created'
      },
      {
        id: 'hist-702',
        timestamp: '2026-10-08T10:00:00.000Z',
        userId: 'closer-2',
        userName: 'Elena Rostova',
        userRole: 'Closer',
        fromStatus: LeadStatus.PENDING,
        toStatus: LeadStatus.LOST,
        note: 'Customer decided to freeze IT spending until next fiscal year. Budget reallocation.',
        actionType: 'status_update'
      }
    ],
    createdAt: '2026-10-06T15:30:00.000Z',
    updatedAt: '2026-10-08T10:00:00.000Z'
  },
  {
    id: 'LF-104928',
    customerName: 'Sophia Valeri',
    phoneNumber: '602-555-8841',
    email: 'sophia@novasolutions.tech',
    serviceInterest: 'AI Workflow Automation',
    appointmentDate: '2026-10-22',
    appointmentTime: '14:00',
    setterId: 'setter-2',
    closerId: 'closer-2',
    status: LeadStatus.PENDING,
    notes: [
      'Looking for automated document classification and customer support triage bots.'
    ],
    history: [
      {
        id: 'hist-801',
        timestamp: '2026-10-11T12:00:00.000Z',
        userId: 'setter-2',
        userName: 'Marcus Vance',
        userRole: 'Appointment Setter',
        fromStatus: null,
        toStatus: LeadStatus.PENDING,
        note: 'Qualified budget $45k+. Urgent requirement.',
        actionType: 'created'
      }
    ],
    createdAt: '2026-10-11T12:00:00.000Z',
    updatedAt: '2026-10-11T12:00:00.000Z'
  }
];

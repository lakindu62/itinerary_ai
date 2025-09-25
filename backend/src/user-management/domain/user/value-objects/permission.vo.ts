import { UserRole } from './user-role.vo';

export enum Permission {
  // Hotel Management
  HOTELS_CREATE = 'hotels.create',
  HOTELS_UPDATE = 'hotels.update',
  HOTELS_DELETE = 'hotels.delete',
  HOTELS_VIEW_ALL = 'hotels.view.all',
  HOTELS_VIEW_BRANCH = 'hotels.view.branch',

  // Booking Management
  BOOKINGS_VIEW_ALL = 'bookings.view.all',
  BOOKINGS_VIEW_BRANCH = 'bookings.view.branch',
  BOOKINGS_MANAGE = 'bookings.manage',

  // Content Management
  CONTENT_CREATE = 'content.create',
  CONTENT_UPDATE = 'content.update',
  CONTENT_DELETE = 'content.delete',

  // Event Management
  EVENTS_CREATE = 'events.create',
  EVENTS_UPDATE = 'events.update',
  EVENTS_DELETE = 'events.delete',

  // Staff Management
  STAFF_INVITE = 'staff.invite',
  STAFF_REMOVE = 'staff.remove',
  STAFF_VIEW = 'staff.view',
}

export const ROLE_PERMISSIONS = {
  [UserRole.BUSINESS_OWNER]: [
    Permission.HOTELS_CREATE,
    Permission.HOTELS_UPDATE,
    Permission.HOTELS_DELETE,
    Permission.HOTELS_VIEW_ALL,
    Permission.BOOKINGS_VIEW_ALL,
    Permission.STAFF_INVITE,
    Permission.STAFF_REMOVE,
    Permission.STAFF_VIEW,
  ],
  [UserRole.BRANCH_MANAGER]: [
    Permission.HOTELS_VIEW_BRANCH,
    Permission.HOTELS_UPDATE,
    Permission.BOOKINGS_VIEW_BRANCH,
    Permission.BOOKINGS_MANAGE,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_UPDATE,
    Permission.EVENTS_CREATE,
    Permission.EVENTS_UPDATE,
    Permission.STAFF_VIEW,
  ],
  [UserRole.CONTENT_MANAGER]: [
    Permission.CONTENT_CREATE,
    Permission.CONTENT_UPDATE,
    Permission.CONTENT_DELETE,
  ],
  [UserRole.EVENT_MANAGER]: [
    Permission.EVENTS_CREATE,
    Permission.EVENTS_UPDATE,
    Permission.EVENTS_DELETE,
  ],
  [UserRole.RESERVATIONS_MANAGER]: [
    Permission.BOOKINGS_VIEW_BRANCH,
    Permission.BOOKINGS_MANAGE,
  ],
};

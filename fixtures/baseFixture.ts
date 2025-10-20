import { BookingFlowPage, PickupDetails } from "../pages/BookingFlowPage";

import { test as base } from "@playwright/test";

type MyFixtures = {
  bookingFlowPage: BookingFlowPage;
  bookingFlowData: PickupDetails;
};

const DEFAULT_BOOKING_DATA: PickupDetails = {
  zip: "80000",
  address: "2305 Steele Street",
  expectedAutoSuggest: "2305 South Steele StreetDenver, CO",
  firstName: "Test",
  lastName: "Staging",
  phone: "5555555555",
  email: process.env.STAGING_USER_EMAIL || "test_staging@example.com",
};

export const test = base.extend<MyFixtures>({
  bookingFlowPage: async ({ page }, use) => {
    const bookingPage = new BookingFlowPage(page);
    await use(bookingPage);
  },

  bookingFlowData: async ({}, use) => {
    await use(DEFAULT_BOOKING_DATA);
  },
});

export { expect } from "@playwright/test";

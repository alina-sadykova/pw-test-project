import { BookingFlowPage } from "../pages/BookingFlowPage";
import { test as base } from "@playwright/test";

type BookingTestData = {
  zip: string;
  address: string;
  expectedAutoSuggest: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type MyFixtures = {
  bookingFlowPage: BookingFlowPage;
  bookingFlowData: BookingTestData;
};

const DEFAULT_BOOKING_DATA: BookingTestData = {
  zip: "80000",
  address: "2305 Steele Street",
  expectedAutoSuggest: "2305 South Steele StreetDenver, CO",
  firstName: "Test",
  lastName: "Staging",
  phone: "5555555555",
  email: "test_staging@example.com",
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

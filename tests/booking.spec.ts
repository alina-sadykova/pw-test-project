import { expect, test } from "../fixtures/baseFixture";

test.describe("Online Booking Flow", () => {
  test.beforeEach(async ({ bookingFlowPage, bookingFlowData }) => {
    await bookingFlowPage.navigateToStart();
    await bookingFlowPage.enterZipAndContinue(bookingFlowData.zip);
  });
  test("AT-001: Step 1: ZIP code entry navigates to date/time selection", async ({
    bookingFlowPage,
  }) => {
    await expect(bookingFlowPage.step2Container).toBeVisible();
  });

  test("AT-002: should have Step 2: Date and time selection works", async ({
    bookingFlowPage,
  }) => {
    await bookingFlowPage.selectDate();
    await bookingFlowPage.selectTimeSlot();
    await bookingFlowPage.goToPickupDetails();

    await expect(bookingFlowPage.step3Container).toBeVisible();
  });

  test("AT-003: should have Step 3: Pickup details and contact info submission", async ({
    bookingFlowPage,
    bookingFlowData,
  }) => {
    await bookingFlowPage.completeLocationAndTimeSelection(bookingFlowData.zip);

    await bookingFlowPage.completePickupDetails(
      bookingFlowData.address,
      bookingFlowData.expectedAutoSuggest,
      bookingFlowData.firstName,
      bookingFlowData.lastName,
      bookingFlowData.phone,
      bookingFlowData.email
    );

    await bookingFlowPage.submitBookingAndWaitForConfirmation();
  });
});

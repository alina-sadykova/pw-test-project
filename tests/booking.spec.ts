import { expect, test } from "../fixtures/baseFixture";

test.describe("Online Booking Flow", () => {
  test.beforeEach(async ({ bookingFlowPage, bookingFlowData }) => {
    await bookingFlowPage.navigateToStart();
    await bookingFlowPage.enterZipAndContinue(bookingFlowData.zip);
  });
  test("AT-001: Step 1: ZIP code entry navigates to date/time selection", async ({
    bookingFlowPage,
  }) => {
    await expect(bookingFlowPage.step2EnterDateAndTimeContainer).toBeVisible();
  });

  test("AT-002: Step 2: Date and time selection works", async ({
    bookingFlowPage,
  }) => {
    await bookingFlowPage.selectDate();
    await bookingFlowPage.selectTimeSlot();
    await bookingFlowPage.goToPickupDetails();
    await expect(
      bookingFlowPage.step3EnterPickupDetailsContainer
    ).toBeVisible();
  });

  test("AT-003: Step 3: Pickup details and contact info submission", async ({
    bookingFlowPage,
    bookingFlowData,
  }) => {
    await bookingFlowPage.completeLocationAndTimeSelection(bookingFlowData.zip);
    await bookingFlowPage.completePickupDetails(bookingFlowData);
    await bookingFlowPage.submitBookingAndWaitForConfirmation();
  });
});

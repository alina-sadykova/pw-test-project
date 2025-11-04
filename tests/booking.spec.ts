import { expect, test } from "../fixtures/baseFixture";

test.describe("Online Booking Flow", () => {
  test("AT-001: Step 1: ZIP code entry navigates to date/time selection", async ({
    bookingFlowPage,
    bookingFlowData,
  }) => {
    await bookingFlowPage.navigateToStart();
    await bookingFlowPage.enterZipAndContinue(bookingFlowData.zip);
    await expect(bookingFlowPage.step2EnterDateAndTimeContainer).toBeVisible();
  });

  test("AT-002: should have Step 2: Date and time selection works", async ({
    bookingFlowPage,
    bookingFlowData,
  }) => {
    await bookingFlowPage.navigateToStart();
    await bookingFlowPage.enterZipAndContinue(bookingFlowData.zip);
    await bookingFlowPage.selectDate();
    await bookingFlowPage.selectTimeSlot();
    await bookingFlowPage.goToPickupDetails();
    await expect(
      bookingFlowPage.step3EnterPickupDetailsContainer
    ).toBeVisible();
  });

  test("AT-003: should have Step 3: Pickup details and contact info submission", async ({
    bookingFlowPage,
    bookingFlowData,
  }) => {
    await bookingFlowPage.navigateToStart();
    await bookingFlowPage.enterZipAndContinue(bookingFlowData.zip);
    await bookingFlowPage.completeLocationAndTimeSelection(bookingFlowData.zip);
    await bookingFlowPage.completePickupDetails(bookingFlowData);

    await expect(bookingFlowPage.bookFreeEstimateButton).toBeEnabled();
    await bookingFlowPage.submitBookingAndWaitForConfirmation();

    await expect(bookingFlowPage.page).toHaveURL(/thank-you/i);
  });
});

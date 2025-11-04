// test/e2e/pages/BookingFlowPage.ts

import { Locator, Page, expect } from "@playwright/test";

import { loadConfig } from "../config/ConfigLoader";

export const currentConfig = loadConfig(process.env.TARGET_ENV || "staging");

export type PickupDetails = {
  zip: string;
  address: string;
  expectedAutoSuggest: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export class BookingFlowPage {
  readonly page: Page;

  // STEP CONTAINERS:
  readonly step1EnterZipContainer: Locator;
  readonly step2EnterDateAndTimeContainer: Locator;
  readonly step3EnterPickupDetailsContainer: Locator;
  readonly closeCookieBannerButton: Locator;

  // STEP 1:
  readonly zipCodeInput: Locator;
  readonly nextButton: Locator;

  // STEP 2:
  readonly datePicker: Locator;
  readonly availableDate: Locator;
  readonly timePicker: Locator;
  readonly availableTime: Locator;
  readonly enterPickupDetailsButton: Locator;

  // STEP 3:
  readonly homeRadioButton: Locator;
  readonly addressInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly bookFreeEstimateButton: Locator;
  readonly saveToAccountButton: Locator;
  // readonly saveToAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // STEP CONTAINERS:
    this.closeCookieBannerButton = page.locator(
      "#onetrust-close-btn-container > button"
    );
    this.step1EnterZipContainer = page.locator("#step1").first();
    this.step2EnterDateAndTimeContainer = page.locator("#step2").first();
    this.step3EnterPickupDetailsContainer = page.locator("#step3").first();

    // STEP 1:
    this.zipCodeInput = this.step1EnterZipContainer.getByPlaceholder(
      "Enter Your Zip Code"
    );
    this.nextButton = this.step1EnterZipContainer.getByRole("button", {
      name: "Next",
    });

    // STEP 2:
    this.datePicker =
      this.step2EnterDateAndTimeContainer.locator("#datepicker-input");
    this.availableDate = this.step2EnterDateAndTimeContainer
      .locator(
        "div.react-datepicker__day:not(.react-datepicker__day--disabled)"
      )
      .first();
    this.timePicker =
      this.step2EnterDateAndTimeContainer.locator("#GJ-OBE-TimePicker");
    this.availableTime = this.step2EnterDateAndTimeContainer
      .locator(".timeList a")
      .first();
    this.enterPickupDetailsButton =
      this.step2EnterDateAndTimeContainer.getByRole("button", {
        name: "ENTER PICK-UP DETAILS",
      });

    // STEP 3:
    this.homeRadioButton = this.step3EnterPickupDetailsContainer.getByRole(
      "radio",
      {
        name: "Home",
      }
    );
    this.addressInput = this.step3EnterPickupDetailsContainer.locator(
      'input[name="address"]'
    );
    this.firstNameInput = this.step3EnterPickupDetailsContainer.locator(
      'input[name="firstName"]'
    );
    this.lastNameInput = this.step3EnterPickupDetailsContainer.locator(
      'input[name="lastName"]'
    );
    this.phoneInput = this.step3EnterPickupDetailsContainer.locator(
      'input[name="phoneNumber"]'
    );
    this.emailInput = this.step3EnterPickupDetailsContainer.locator(
      'input[name="email"]'
    );
    this.bookFreeEstimateButton =
      this.step3EnterPickupDetailsContainer.getByRole("button", {
        name: "Book Free Onsite Estimate",
      });
    this.saveToAccountButton = page.getByRole("link", {
      name: "SAVE TO ACCOUNT",
    });
  }

  // METHODS:
  async navigateToStart() {
    const cookieBanner = this.page.locator("#onetrust-accept-btn-handler");
    if (await cookieBanner.isVisible()) await cookieBanner.click();

    await this.page.goto(`${currentConfig.baseUrl}${currentConfig.startPath}`);
  }

  async closeCookieBanner(): Promise<void> {
    await expect(this.closeCookieBannerButton).toBeVisible();
    await this.closeCookieBannerButton.click();
  }

  // Step 1: ZIP entry
  async enterZipAndContinue(zip: string) {
    if (!(await this.step1EnterZipContainer.isVisible())) return; // Skip if Step 1 is hidden

    await this.zipCodeInput.waitFor({ state: "visible" });
    const isEditable = await this.zipCodeInput.evaluate(
      (el) => !el.hasAttribute("readonly")
    );
    if (!isEditable) throw new Error("ZIP input is not editable yet");

    await this.zipCodeInput.fill(zip);
    await this.nextButton.click();
  }

  // Step 2: Choose date and time
  async selectDate(): Promise<void> {
    await expect(this.datePicker).toBeVisible();
    await this.datePicker.click();
    await this.availableDate.waitFor({ state: "visible" });
    await this.availableDate.click();
    await this.page.waitForTimeout(2000);
  }

  async selectTimeSlot(): Promise<void> {
    await expect(this.timePicker).toBeVisible();
    await this.timePicker.click();
    await this.availableTime.click();
  }

  async goToPickupDetails(): Promise<void> {
    await expect(this.enterPickupDetailsButton).toBeVisible();
    await this.enterPickupDetailsButton.click();
  }

  async completeLocationAndTimeSelection(zip: string): Promise<void> {
    await this.selectDate();
    await this.selectTimeSlot();
    await this.goToPickupDetails();
  }

  // Step 3: Enter pick-up details

  async selectHomeLocation(): Promise<void> {
    await expect(this.homeRadioButton).toBeVisible();
    await this.homeRadioButton.check();
  }

  async fillPickupAddress(
    address: string,
    expectedAutoSuggest: string
  ): Promise<void> {
    await expect(this.addressInput).toBeVisible();
    await this.addressInput.click();
    // await this.page.waitForTimeout(2000);
    await this.addressInput.fill(address);
    // await this.page.waitForTimeout(1000);
    await this.page.getByText(expectedAutoSuggest).click();
  }

  async fillContactDetails(
    firstName: string,
    lastName: string,
    phone: string,
    email: string
  ) {
    await expect(this.firstNameInput).toBeVisible();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.phoneInput.fill(phone);
    await this.emailInput.fill(email);
  }

  async completePickupDetails(details: PickupDetails): Promise<void> {
    const { address, expectedAutoSuggest, firstName, lastName, phone, email } =
      details;
    await this.selectHomeLocation();
    await this.fillPickupAddress(address, expectedAutoSuggest);
    await this.fillContactDetails(firstName, lastName, phone, email);
  }

  async submitBookingAndWaitForConfirmation() {
    const successUrlPath = "**/onlinebooking/thank-you";

    await Promise.all([
      this.page.waitForURL(successUrlPath, { timeout: 45000 }),
      this.bookFreeEstimateButton.click(),
    ]);

    const successHeading = this.page.locator("#obe-spa h1");
    await expect(successHeading).toBeVisible();
  }
}

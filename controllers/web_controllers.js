const puppeteer = require("puppeteer");

const verifyCoupon = async (req, res, next) => {
  try {
    var url = `https://www.amazon.com/dp/${req.params.asin}`;
    var browser = await puppeteer.launch({ headless: false });
    var myPage = await browser.newPage();

    //Product Page
    await myPage.goto(url, { timeout: 0 });

    try {
      let heading = await myPage.evaluate(() => {
        var data = document.querySelector(
          'div[class="a-box-inner"] > h4'
        ).innerText;
        return data;
      });

      if (heading == "Enter the characters you see below") {
        var [reload] = await myPage.$x(
          "/html/body/div/div[1]/div[3]/div/div/form/div[1]/div/div/div[2]/div/div[2]/a"
        );
        await reload.click();
        await myPage.waitForNavigation({ timeout: 0 });
      }
    } catch (e) {
    } finally {
      /*
      await myPage.click("#nav-global-location-popover-link");
      
        new Promise((resolve) => myPage.once('popup', resolve));
        await myPage.waitForSelector("#GLUXZipUpdateInput");
        await myPage.type('#GLUXZipUpdateInput', "92410");
        await myPage.waitForSelector("#GLUXZipUpdate");
        await myPage.click('#GLUXZipUpdate');
        await myPage.waitForNavigation();
        await Promise.all([
          myPage.click(".a-modal-scroller a-declarative"[0]),
        ]);
        */

      // await myPage.waitForNavigation();
      // new Promise((resolve) => myPage.once('popup', resolve));
      // await myPage.waitForSelector("#GLUXConfirmClose");
      // await myPage.click("#GLUXConfirmClose");

      await myPage.click("#buy-now-button");
      await myPage.waitForNavigation({ timeout: 0 });

      //Login Page (email)
      await myPage.type("#ap_email", "coupup00@gmail.com");
      await myPage.click("#continue");
      await myPage.waitForNavigation({ timeout: 0 });

      //Login Page (password)
      await myPage.type("#ap_password", "abc123");
      await Promise.all([
        myPage.waitForNavigation(),
        myPage.click("#signInSubmit"),
      ]);

      try {
        //Address Page
        const fullName = await myPage.$(
          "#address-ui-widgets-enterAddressFullName"
        );
        await fullName.click({ clickCount: 3 });
        await fullName.type("JohnDoe");

        const phone = await myPage.$(
          "#address-ui-widgets-enterAddressPhoneNumber"
        );
        await phone.click({ clickCount: 3 });
        await phone.type("123456789");

        const address1 = await myPage.$(
          "#address-ui-widgets-enterAddressLine1"
        );
        await address1.click({ clickCount: 3 });
        await address1.type("814 W 8TH ST");

        const address2 = await myPage.$(
          "#address-ui-widgets-enterAddressLine2"
        );
        await address2.click({ clickCount: 3 });
        await address2.type("SAN BERNARDINO CA 92404 SAN BERNARDINO CA 9241");

        const city = await myPage.$("#address-ui-widgets-enterAddressCity");
        await city.click({ clickCount: 3 });
        await city.type("SAN BERNARDINO");

        const postalCode = await myPage.$(
          "#address-ui-widgets-enterAddressPostalCode"
        );
        await postalCode.click({ clickCount: 3 });
        await postalCode.type("92410-2921");

        var [stateDropdown] = await myPage.$x(
          '//*[@id="address-ui-widgets-enterAddressStateOrRegion"]/span/span'
        );
        await stateDropdown.click();

        const [state] = await myPage.$x(
          '//*[@id="1_dropdown_combobox"]/li[6]/a'
        );
        await state.click();

        const [save] = await myPage.$x(
          '//*[@id="address-ui-widgets-form-submit-button"]/span/input'
        );
        await save.click();
        await myPage.waitForNavigation({ timeout: 0 });

        Working;
        const elHandleArray = await myPage.$$("a");
        console.log(elHandleArray.length);
        elHandleArray.forEach(async (el) => {
          await el.click();
        });
      } catch (e) {}

      await Promise.all([
        await myPage.evaluate(() => {
          let elements = document.getElementsByClassName(
            "a-expander-header a-declarative a-expander-inline-header pmts-apply-claim-code a-spacing-base a-link-expander"
          );
          for (let element of elements) element.click();
        }),
      ]);

      const elHandleArray = await myPage.$$("input");
      console.log(elHandleArray.length);
      await elHandleArray[13].type(req.params.coupon);

      await Promise.all([
        await myPage.evaluate(() => {
          let elements = document.getElementsByClassName(
            "a-button-input a-button-text"
          );
          for (let element of elements) element.click();
        }),
      ]);

      try {
        await myPage.waitForSelector(".a-list-item", { timeout: 2000 });
      } catch (e) {
        console.log(e.message);
      } finally {
        var list = await myPage.$$(".a-list-item");
        if (list[0] === undefined) {
          res.send({ message: "Message not found" });
        } else {
          var text = await myPage.evaluate((el) => el.textContent, list[0]);
          if (text.trim() == "The promotional code you entered is not valid.") {
            res.send({ message: "Coupon is invalid" });
          } else {
            res.send({ message: "Coupon is valid" });
          }
        }
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  verifyCoupon,
};

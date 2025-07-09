import { delay } from './delay.js';

export async function loginOnce(page, USERNAME, PASSWORD) {
    try {
        // Wait for the login form to appear
        await page.waitForSelector('input[name="username"]', { timeout: 10000 });

        // Fill in credentials
        await page.type('input[name="username"]', USERNAME, { delay: 100 });
        await page.type('input[name="password"]', PASSWORD, { delay: 100 });

        // Small human-like delay before clicking
        await delay(500 + Math.random() * 1000);

        // Find and click the login button
        const submitButton = await page.$('button[type="submit"]');
        if (!submitButton) throw new Error("Login button not found");
        console.log("submit button: ", submitButton)
        // Use element handle click for reliability
        await submitButton.click();

        // Wait for a clear login confirmation
        const loggedIn = await Promise.race([
            page.waitForSelector('svg[aria-label="Home"]', { timeout: 15000 }),
            page.waitForSelector('[href="/accounts/"]', { timeout: 15000 }),
            page.waitForSelector('div[role="alert"]', { timeout: 15000 }).then(() => false)  // Error message case
        ]);

        if (!loggedIn) {
            console.log("Login failed, possible wrong credentials or challenge.");
            return false;
        }

        console.log("Login successful!");
        return true;

    } catch (error) {
        console.error("Login error:", error.message);
        return false;
    }
}

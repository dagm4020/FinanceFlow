// creating the ai insights test class

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.Test;

import dev.failsafe.internal.util.Assert;

public class AiInsightsSeleniumTest extends BaseTest {

    


    private void login(String username, String password) {

                // Set up ChromeDriver (brave)
        System.setProperty("webdriver.chrome.driver", "lib/chromedriver.exe");
   
        WebElement usernameField = driver.findElement(By.id("username")); 
        usernameField.sendKeys(username);
        
        WebElement passwordField = driver.findElement(By.id("password")); 
        passwordField.sendKeys(password);
        

        WebElement loginButton = driver.findElement(By.id("loginButton")); 
        loginButton.click();
    }

    // Helper method to navigate to AI Insights page
    private void navigateToAiInsights() {

        WebElement aiInsightsNav = driver.findElement(By.id("aiInsightsNav")); 
        aiInsightsNav.click();
    }


    private void submitAiInsightsRequest(String userId) {
       
        WebElement userIdField = driver.findElement(By.id("userId")); 
        userIdField.clear();
        userIdField.sendKeys(userId);

        WebElement submitButton = driver.findElement(By.id("submitAiInsights")); 
        submitButton.click();
    }

    // Test Case TC_AI_001_Selenium: Valid Request
    @Test
    public void testValidRequest() {

        login("user1", "pass123");
        navigateToAiInsights();
        submitAiInsightsRequest("123");

        WebElement insightElement = driver.findElement(By.id("insight")); 
        WebElement statusElement = driver.findElement(By.id("status")); 
        
        String expectedInsight = "You can save $200 this month by reducing dining expenses by 15%.";
        String expectedStatus = "success";
        
        Assert.assertEquals(insightElement.getText(), expectedInsight, "Insight message does not match.");
        Assert.assertEquals(statusElement.getText(), expectedStatus, "Status message does not match.");
    }

    @Test
    public void testUserWithNoData() {

        login("user1", "pass123");
        navigateToAiInsights();
        submitAiInsightsRequest("999");
        

        WebElement errorElement = driver.findElement(By.id("error")); 
        String expectedError = "No financial data found for this user.";
        Assert.assertEquals(errorElement.getText(), expectedError, "Error message does not match.");
    }

    // Test Case TC_AI_003_Selenium: Invalid JWT Token
    @Test
    public void testInvalidJwtToken() {

        login("user1", "pass123");
        driver.manage().deleteAllCookies();
        navigateToAiInsights();
        WebElement errorElement = driver.findElement(By.id("error")); 
        String expectedError = "Unauthorized access.";
        Assert.assertEquals(errorElement.getText(), expectedError, "Unauthorized access message does not match.");
    }

    // Test Case TC_AI_004_Selenium: Missing JWT Token
    @Test
    public void testMissingJwtToken() {
       
        driver.get(baseUrl + "/ai-insights"); 
        submitAiInsightsRequest("123");
        WebElement errorElement = driver.findElement(By.id("error")); 
        String expectedError = "Authentication token is missing.";
        Assert.assertEquals(errorElement.getText(), expectedError, "Authentication error message does not match.");
    }

    // Test Case TC_AI_005_Selenium: Non-Existent User
    @Test
    public void testNonExistentUser() {
        login("user1", "pass123");
        navigateToAiInsights();
        submitAiInsightsRequest("456");
        

        WebElement errorElement = driver.findElement(By.id("error")); 
        String expectedError = "User not found.";
        Assert.assertEquals(errorElement.getText(), expectedError, "Error message does not match.");
    }

    // Test Case TC_AI_006_Selenium: Invalid Request Body Format
    @Test
    public void testInvalidRequestBodyFormat() {

        login("user1", "pass123");
        navigateToAiInsights();
        submitAiInsightsRequest("abc"); 
        
        WebElement errorElement = driver.findElement(By.id("error")); 
        String expectedError = "Invalid request format. Missing 'userID' field.";
        Assert.assertEquals(errorElement.getText(), expectedError, "Error message does not match.");
    }

    // Test Case TC_AI_007_Selenium: Valid Request with Large Data
    @Test
    public void testValidRequestWithLargeData() {
     
        login("user1", "pass123");
        navigateToAiInsights();
        submitAiInsightsRequest("789");
        

        WebElement insightElement = driver.findElement(By.id("insight")); 
        WebElement statusElement = driver.findElement(By.id("status")); 
        
        String expectedInsight = "Your average monthly spending on dining is $500. Consider using a dining rewards program to save $50 per month.";
        String expectedStatus = "success";
        
        Assert.assertEquals(insightElement.getText(), expectedInsight, "Insight message does not match.");
        Assert.assertEquals(statusElement.getText(), expectedStatus, "Status message does not match.");
    }

    // Test Case TC_AI_008_Selenium: Server Error Simulation
    @Test
    public void testServerError() {

        login("user1", "pass123");
        navigateToAiInsights();
        submitAiInsightsRequest("123");
        

        WebElement errorElement = driver.findElement(By.id("error")); 
        String expectedError = "Internal server error. Please try again later.";
        Assert.assertEquals(errorElement.getText(), expectedError, "Server error message does not match.");
    }
}
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class LoginTest {
    public static void main(String[] args) {

        System.setProperty("webdriver.chrome.driver", "lib/chromedriver.exe");

        ChromeOptions options = new ChromeOptions();
        options.setBinary("C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe");

        WebDriver driver = new ChromeDriver(options);

        try {

            driver.get("http://localhost:3000/login");

            WebElement emailField = driver.findElement(By.id("email"));
            WebElement passwordField = driver.findElement(By.id("password"));
            WebElement loginButton = driver.findElement(By.tagName("button"));

            emailField.sendKeys("rdoe@gmail.com");
            passwordField.sendKeys("pass");

            loginButton.click();

            Thread.sleep(2000);

            if (driver.getCurrentUrl().equals("http://localhost:3000/dashboard")) {
                System.out.println("Test Passed: Successfully logged in.");
            } else {
                System.out.println("Test Failed: Incorrect redirection.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {

            driver.quit();
        }
    }
}

# Automation Exercise with Playwright

## Project Overview

This project provides end-to-end test automation for the [Automation Exercise website](http://automationexercise.com/) using Playwright. It follows best practices for test automation, including the Page Object Model (POM) design pattern, to create robust, maintainable, and scalable tests.

## Setup Instructions

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd Automation_Exercise_Playwright
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## How to Run Tests

Tests can be run using the Playwright Test Runner. Here are some common commands:

- **Run all tests:**

  ```bash
  npx playwright test
  ```

- **Run tests in UI mode:**

  ```bash
  npx playwright test --ui
  ```

- **Run specific test file:**

  ```bash
  npx playwright test tests/example.spec.ts
  ```

- **Run tests with a specific tag (e.g., @smoke):**

  ```bash
  npx playwright test --grep "@smoke"
  ```

- **Generate HTML report:**

  ```bash
  npx playwright show-report
  ```

## Project Structure

The project is organized as follows:

- `tests/`: Contains all the test specification files.
- `src/pages/`: Implements the Page Object Model, with each file representing a page or a major component of the application.
  - `PageObjectManager.ts`: Centralizes the creation and management of all page objects.
- `src/utils/`: Contains utility functions and helper methods used across the tests.
- `playwright.config.ts`: Playwright configuration file.
- `playwright-report/`: Generated test reports.
- `test-results/`: Stores traces, screenshots, and videos for test runs.

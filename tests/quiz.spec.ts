import { test, expect } from '@playwright/test';

const TOTAL_QUESTIONS = 24;

// Helper: answer the current question by clicking option at given index (0-based)
async function answerQuestion(page: import('@playwright/test').Page, optionIndex: number) {
  await page.locator('[role="radio"]').nth(optionIndex).click();
}

// Helper: answer a question and wait for the counter to show the next question number
async function answerAndAdvance(page: import('@playwright/test').Page, optionIndex: number, nextQ: number) {
  await answerQuestion(page, optionIndex);
  await expect(page.getByTestId('quiz-counter')).toContainText(`${nextQ} /`, { timeout: 3000 });
}

// Helper: answer N questions in a row, always picking the first option
async function answerNQuestions(page: import('@playwright/test').Page, n: number) {
  for (let i = 0; i < n; i++) {
    if (i < n - 1) {
      await answerAndAdvance(page, 0, i + 2);
    } else {
      await answerQuestion(page, 0);
      await page.waitForTimeout(500);
    }
  }
}

// Helper: wait for quiz to be ready (past loading state)
async function waitForQuiz(page: import('@playwright/test').Page) {
  await expect(page.locator('[role="radiogroup"]')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('quiz-counter')).toBeVisible({ timeout: 5000 });
}

const counter = (page: import('@playwright/test').Page) => page.getByTestId('quiz-counter');

test.describe('Landing page', () => {
  test('renders correctly and has a start button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Discover Your')).toBeVisible();
    await expect(page.getByRole('button', { name: /start the quiz/i })).toBeVisible();
  });

  test('navigates to quiz on start', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /start the quiz/i }).click();
    await expect(page).toHaveURL('/quiz');
  });
});

test.describe('Quiz flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /start the quiz/i }).click();
    await expect(page).toHaveURL('/quiz');
    await waitForQuiz(page);
  });

  test('shows question 1 with progress bar', async ({ page }) => {
    await expect(counter(page)).toContainText('1 /');
    await expect(page.locator('[role="radiogroup"]')).toBeVisible();
  });

  test('progress counter advances after answering', async ({ page }) => {
    await answerAndAdvance(page, 0, 2);
    await expect(counter(page)).toContainText('2 /');
  });

  test('selecting an option highlights it', async ({ page }) => {
    const firstOption = page.locator('[role="radio"]').first();
    await firstOption.click();
    await expect(firstOption).toHaveAttribute('aria-checked', 'true');
  });

  test('auto-advances to the next question after ~300ms', async ({ page }) => {
    await expect(counter(page)).toContainText('1 /');
    await answerAndAdvance(page, 1, 2);
    await expect(counter(page)).toContainText('2 /');
  });

  test('back button is invisible on question 1', async ({ page }) => {
    await expect(page.getByRole('button', { name: /back/i })).toBeHidden();
  });

  test('back button appears from question 2 onwards', async ({ page }) => {
    await answerAndAdvance(page, 0, 2);
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
  });

  test('back button returns to previous question', async ({ page }) => {
    await answerAndAdvance(page, 0, 2);
    await expect(counter(page)).toContainText('2 /');
    await page.getByRole('button', { name: /back/i }).click();
    await expect(counter(page)).toContainText('1 /');
  });

  test('can go back and re-answer, then continue forward', async ({ page }) => {
    await answerAndAdvance(page, 0, 2);
    await expect(counter(page)).toContainText('2 /');

    await page.getByRole('button', { name: /back/i }).click();
    await expect(counter(page)).toContainText('1 /');

    // Re-answer with a different option — should advance to Q2
    await answerAndAdvance(page, 2, 2);
    await expect(counter(page)).toContainText('2 /');
  });

  test('can go back multiple questions and re-answer', async ({ page }) => {
    await answerNQuestions(page, 3);
    await expect(counter(page)).toContainText('4 /');

    await page.getByRole('button', { name: /back/i }).click();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: /back/i }).click();
    await expect(counter(page)).toContainText('2 /');

    await answerAndAdvance(page, 1, 3);
    await expect(counter(page)).toContainText('3 /');
  });

  test('shows "See My Results" button only on the last question', async ({ page }) => {
    await expect(page.getByRole('button', { name: /see my results/i })).not.toBeVisible();

    await answerNQuestions(page, TOTAL_QUESTIONS - 1);
    await expect(counter(page)).toContainText(`${TOTAL_QUESTIONS} /`);
    await expect(page.getByRole('button', { name: /see my results/i })).toBeVisible();
  });

  test('last question does not auto-advance — requires button click', async ({ page }) => {
    await answerNQuestions(page, TOTAL_QUESTIONS - 1);
    await expect(counter(page)).toContainText(`${TOTAL_QUESTIONS} /`);

    await answerQuestion(page, 0);
    await page.waitForTimeout(600);

    await expect(page).toHaveURL('/quiz');
    await expect(page.getByRole('button', { name: /see my results/i })).toBeVisible();
  });

  test('completes quiz and navigates to email capture', async ({ page }) => {
    await answerNQuestions(page, TOTAL_QUESTIONS - 1);
    await answerQuestion(page, 0);
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: /see my results/i }).click();
    await expect(page).toHaveURL('/email-capture');
  });

  test('shows progress phrase that updates as quiz progresses', async ({ page }) => {
    await expect(page.getByText('Just getting started! 🌟')).toBeVisible();
    await answerNQuestions(page, Math.ceil(TOTAL_QUESTIONS * 0.25) + 1);
    await expect(page.getByText('Great progress! 👍')).toBeVisible();
  });

  test('category pill is visible and capitalised', async ({ page }) => {
    const pill = page.locator('span').filter({ hasText: /^(Process|Strategy|Insight|Culture)$/ }).first();
    await expect(pill).toBeVisible();
  });
});

test.describe('Mobile viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /start the quiz/i }).click();
    await expect(page).toHaveURL('/quiz');
    await waitForQuiz(page);
  });

  test('quiz fits in mobile viewport without scrolling', async ({ page }) => {
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    expect(scrollHeight).toBeLessThanOrEqual(viewportHeight + 50);
  });

  test('landing page renders correctly on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /start the quiz/i })).toBeVisible();
  });

  test('options are large enough to tap (min 44px height)', async ({ page }) => {
    const firstOption = page.locator('[role="radio"]').first();
    const box = await firstOption.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Email capture page', () => {
  async function completeQuiz(page: import('@playwright/test').Page) {
    await page.goto('/');
    await page.getByRole('button', { name: /start the quiz/i }).click();
    await waitForQuiz(page);
    await answerNQuestions(page, TOTAL_QUESTIONS - 1);
    await answerQuestion(page, 0);
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: /see my results/i }).click();
    await expect(page).toHaveURL('/email-capture');
  }

  test('shows branded heading and value proposition', async ({ page }) => {
    await completeQuiz(page);
    await expect(page.getByRole('heading', { name: 'Your results are ready' })).toBeVisible();
    await expect(page.getByText(/personalised maturity score/i)).toBeVisible();
  });

  test('skip link navigates to results', async ({ page }) => {
    await completeQuiz(page);
    await page.getByRole('button', { name: /skip and see results/i }).click();
    await expect(page).toHaveURL('/results');
  });

  test('shows Kyzn logo', async ({ page }) => {
    await completeQuiz(page);
    await expect(page.getByAltText('Kyzn Academy')).toBeVisible();
  });
});

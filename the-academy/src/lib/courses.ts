export interface Lesson {
  title: string;
  summary: string;
  content: string;
  slug: string;
}

export interface Course {
  title: string;
  description: string;
  lessons: Lesson[];
}

export const creditCardsCourse: Course = {
  title: "Credit Cards",
  description:
    "A comprehensive guide to understanding credit cards, building credit, and maximizing rewards without falling into debt.",
  lessons: [
    {
      title: "Lesson 1: The Basics of Credit Cards",
      summary:
        "Understand what credit cards are, how they function, and what makes them a powerful financial tool when used responsibly.",
      slug: "credit-cards-lesson-1",
      content: `## Lesson 1: The Basics of Credit Cards

Credit cards are more than just pieces of plastic—they are short-term loans issued by banks that can help build financial credibility when handled correctly.

### 1. How Credit Cards Work
- You receive a credit limit (a maximum amount you can borrow)
- You spend money using the card and receive a monthly bill
- Pay within the grace period to avoid interest
- Carrying a balance incurs interest, often at 30%+ APR in India

### 2. Key Terms You Must Know
- **Billing Cycle:** Usually 30 days. Purchases made during this period become part of your next bill.
- **Statement Date:** The date your total dues are calculated.
- **Due Date:** Typically 15-20 days after the statement date. Paying in full by this date ensures zero interest.
- **Minimum Due:** The smallest amount you must pay to avoid default. Paying only this leads to high interest and traps.

### 3. Why You Should Care
- Builds credit history (vital for loans later)
- Offers rewards, cashback, air miles, and lifestyle perks
- Provides fraud protection and dispute resolution
- Enables emergency purchases without liquid cash

### 4. How to Use Credit Cards Wisely
- Never spend beyond what you can repay in full each month
- Automate payments to avoid missing due dates
- Track spending via your bank app or CRED
- Aim for a credit utilization ratio below 30%

### 5. When NOT to Use Them
- Cash withdrawals (heavy fees + instant interest)
- For people with unstable income or poor financial discipline
- To fund impulsive purchases

**Key Takeaway:** A credit card is a tool, not free money. Treat it like a debit card with a 45-day buffer. In the next lesson, we'll deep dive into building and maintaining a strong credit score in India.`,
    },
  ],
};

export const pianoBasicsCourse: Course = {
  title: "Piano Basics",
  description: "Learn the fundamentals of piano playing.",
  lessons: [
    {
      title: "Lesson 1: Three-Note Walk",
      summary: "Introduction to the first three notes on the keyboard.",
      slug: "piano-basics-lesson-1",
      content: `## Lesson 1: Three-Note Walk

In this lesson, we will learn our first three notes: C, D, and E.

[APP ACTION:PianoMidiEngine]

Try playing C4, D4, and E4 on your MIDI keyboard.

[SHEET_MUSIC: notes="C4/q, D4/q, E4/h"]`,
    },
  ],
};

export const courses = [creditCardsCourse, pianoBasicsCourse];


import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollIntoView — stub it so components that call it
// (e.g. HistoryView's sprint-jump nav) don't throw in tests.
Element.prototype.scrollIntoView = vi.fn();

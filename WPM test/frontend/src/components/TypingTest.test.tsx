import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MIN_TYPING_TEXTAREA_ROWS, TypingTest } from "./TypingTest";

type HookReturn = ReturnType<
  typeof import("../hooks/useTypingTest").useTypingTest
>;

function baseMock(overrides: Partial<HookReturn> = {}): HookReturn {
  const base: HookReturn = {
    paragraph: { id: "1", text: "The quick brown fox." },
    loadingParagraph: false,
    loadError: null,
    input: "",
    onInputChange: vi.fn(),
    phase: "waiting",
    timeRemaining: 60,
    wpm: 0,
    accuracy: 100,
    charactersTyped: 0,
    correctChars: 0,
    finalSummary: null,
    submitting: false,
    submitError: null,
    pastResults: [],
    resultsError: null,
    restart: vi.fn(),
    reloadResults: vi.fn(),
  };
  return { ...base, ...overrides };
}

const mockUseTypingTest = vi.fn((): HookReturn => baseMock());

vi.mock("../hooks/useTypingTest", async () => {
  const actual = await vi.importActual<typeof import("../hooks/useTypingTest")>(
    "../hooks/useTypingTest"
  );
  return {
    ...actual,
    useTypingTest: () => mockUseTypingTest(),
  };
});

describe("TypingTest", () => {
  beforeEach(() => {
    mockUseTypingTest.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders textarea without internal scroll and with auto-row sizing classes", () => {
    mockUseTypingTest.mockImplementation(() => baseMock());
    render(<TypingTest />);
    const ta = screen.getByTestId("typing-textarea") as HTMLTextAreaElement;
    expect(ta.className).toMatch(/resize-none/);
    expect(ta.className).toMatch(/overflow-hidden/);
    expect(ta.rows).toBeGreaterThanOrEqual(MIN_TYPING_TEXTAREA_ROWS);
  });

  it("expands rows for multiline input (no duplicate controls)", () => {
    const multiline = "a\nb\nc\nd";
    mockUseTypingTest.mockImplementation(() =>
      baseMock({
        input: multiline,
        phase: "running",
        charactersTyped: multiline.length,
        correctChars: 0,
      })
    );
    const gCS = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation(
      (elt, pseudoElt) => {
        const real = gCS(elt as Element, pseudoElt);
        if (elt instanceof HTMLTextAreaElement) {
          return new Proxy(real, {
            get(target, prop, receiver) {
              if (prop === "lineHeight") return "20px";
              const value = Reflect.get(target, prop, receiver);
              if (typeof value === "function") {
                return value.bind(target);
              }
              return value;
            },
          });
        }
        return real;
      }
    );
    const originalDesc = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "scrollHeight"
    );
    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
      configurable: true,
      get() {
        return 80;
      },
    });
    render(<TypingTest />);
    const textareas = screen.getAllByTestId("typing-textarea");
    expect(textareas).toHaveLength(1);
    const ta = textareas[0] as HTMLTextAreaElement;
    expect(ta.rows).toBeGreaterThanOrEqual(4);
    vi.restoreAllMocks();
    if (originalDesc) {
      Object.defineProperty(
        HTMLTextAreaElement.prototype,
        "scrollHeight",
        originalDesc
      );
    }
  });

  it("places WPM over time section above Previous results", () => {
    mockUseTypingTest.mockImplementation(() =>
      baseMock({
        pastResults: [
          {
            id: "r1",
            wpm: 40,
            accuracy: 96,
            charactersTyped: 180,
            durationSeconds: 60,
            completedAt: "2026-03-28T12:00:00.000Z",
          },
        ],
      })
    );
    render(<TypingTest />);
    const wpmHeading = screen.getByRole("heading", { name: "WPM over time" });
    const prevHeading = screen.getByRole("heading", {
      name: "Previous results",
    });
    expect(
      wpmHeading.compareDocumentPosition(prevHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});

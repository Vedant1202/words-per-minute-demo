import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParagraphPreview } from "./TypingTest";

describe("ParagraphPreview", () => {
  it("wraps within the card using break-words and max-w-full", () => {
    const { container } = render(
      <ParagraphPreview target="hello world" typed="" phase="waiting" />
    );
    const preview = container.querySelector('[aria-live="polite"]');
    expect(preview).toBeTruthy();
    expect(preview).toHaveClass("break-words", "max-w-full");
  });

  it("uses regular spaces so lines can wrap at word boundaries", () => {
    const { container } = render(
      <ParagraphPreview target="one two three" typed="" phase="waiting" />
    );
    const preview = container.querySelector('[aria-live="polite"]');
    expect(preview?.textContent).toBe("one two three");
    expect(preview?.innerHTML.includes("\u00a0")).toBe(false);
  });
});

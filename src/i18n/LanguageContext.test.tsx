import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

const STORAGE_KEY = "jobAppToolkit.lang";

function Probe() {
  const { lang, t, toggleLang } = useLanguage();
  return (
    <div>
      <p data-testid="lang">{lang}</p>
      <p data-testid="title">{t.home.title}</p>
      <button onClick={toggleLang}>toggle</button>
    </div>
  );
}

describe("LanguageProvider", () => {
  const originalLanguageGetter = Object.getOwnPropertyDescriptor(window.Navigator.prototype, "language");

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    if (originalLanguageGetter) {
      Object.defineProperty(window.Navigator.prototype, "language", originalLanguageGetter);
    }
  });

  it("defaults to Indonesian when no language is saved and browser locale isn't English", () => {
    Object.defineProperty(window.Navigator.prototype, "language", {
      configurable: true,
      get: () => "id-ID",
    });
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId("lang").textContent).toBe("id");
    expect(screen.getByTestId("title").textContent).toBe("Buat Lamaran Kerjamu Lebih Cerdas");
  });

  it("defaults to English when the browser locale is English", () => {
    Object.defineProperty(window.Navigator.prototype, "language", {
      configurable: true,
      get: () => "en-US",
    });
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId("lang").textContent).toBe("en");
  });

  it("switches the rendered text when toggled, and persists the choice", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    // jsdom's default navigator.language is en-US, so this starts in English.
    expect(screen.getByTestId("lang").textContent).toBe("en");

    fireEvent.click(screen.getByText("toggle"));

    expect(screen.getByTestId("lang").textContent).toBe("id");
    expect(screen.getByTestId("title").textContent).toBe("Buat Lamaran Kerjamu Lebih Cerdas");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("id");
  });

  it("restores the previously saved language on next load", () => {
    window.localStorage.setItem(STORAGE_KEY, "en");
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId("lang").textContent).toBe("en");
  });
});

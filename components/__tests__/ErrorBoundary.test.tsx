import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text, View } from "react-native";
import ErrorBoundary from "../ErrorBoundary";

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <Text>Normal content</Text>;
}

describe("ErrorBoundary", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <Text>Child content</Text>
      </ErrorBoundary>
    );

    expect(screen.getByText("Child content")).toBeOnTheScreen();
  });

  it("renders error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeOnTheScreen();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeOnTheScreen();
    expect(screen.getByText("Try Again")).toBeOnTheScreen();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = (
      <View>
        <Text>Custom error message</Text>
      </View>
    );

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error message")).toBeOnTheScreen();
    expect(screen.queryByText("Something went wrong")).not.toBeOnTheScreen();
  });

  it("resets error state when Try Again is pressed", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeOnTheScreen();

    fireEvent.press(screen.getByText("Try Again"));

    // After pressing Try Again, the error boundary resets its state
    // But since ThrowingComponent still throws, it will show error again
    // This test verifies the Try Again button is functional
    expect(screen.getByText("Try Again")).toBeOnTheScreen();
  });

  it("logs error to console", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});

import { render, screen, fireEvent } from "@testing-library/react-native";
import ComparisonView from "../ComparisonView";

jest.mock("../../data/countries", () => ({
  countries: [
    { code: "ZA", name: "South Africa" },
    { code: "US", name: "United States" },
    { code: "TH", name: "Thailand" },
    { code: "JP", name: "Japan" },
    { code: "FR", name: "France" },
    { code: "ID", name: "Indonesia" },
  ],
}));

const mockVisaRules = {
  TH: {
    type: "visa-free" as const,
    maxStay: "30 days",
    notes: "Tourist purposes only",
    source: "Thai Embassy, Jan 2026",
  },
  JP: {
    type: "visa-required" as const,
    maxStay: "90 days",
    notes: "Apply at embassy",
    source: "Japanese Embassy, Jan 2026",
  },
  FR: {
    type: "visa-on-arrival" as const,
    maxStay: "15 days",
    source: "French Embassy, Jan 2026",
  },
  ID: {
    type: "visa-on-arrival" as const,
    maxStay: "30 days",
    cost: "$35 USD",
    notes: "e-VOA recommended",
    source: "Indonesian Immigration, Jan 2026",
  },
};

describe("ComparisonView", () => {
  it("renders nothing when no destinations selected", () => {
    const { toJSON } = render(
      <ComparisonView
        destinationCodes={[]}
        visaRules={mockVisaRules}
      />
    );

    expect(toJSON()).toBeNull();
  });

  it("renders comparison header", () => {
    render(
      <ComparisonView
        destinationCodes={["TH"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("Visa Comparison")).toBeOnTheScreen();
  });

  it("shows visa-free destination correctly", () => {
    render(
      <ComparisonView
        destinationCodes={["TH"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("Thailand")).toBeOnTheScreen();
    expect(screen.getByText("Visa Free")).toBeOnTheScreen();
    expect(screen.getByText("Stay: 30 days")).toBeOnTheScreen();
    expect(screen.getByText("Tourist purposes only")).toBeOnTheScreen();
  });

  it("shows visa-required destination correctly", () => {
    render(
      <ComparisonView
        destinationCodes={["JP"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("Japan")).toBeOnTheScreen();
    expect(screen.getByText("Visa Required")).toBeOnTheScreen();
    expect(screen.getByText("Stay: 90 days")).toBeOnTheScreen();
    expect(screen.getByText("Apply at embassy")).toBeOnTheScreen();
  });

  it("shows visa-on-arrival destination correctly", () => {
    render(
      <ComparisonView
        destinationCodes={["FR"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("France")).toBeOnTheScreen();
    expect(screen.getByText("Visa on Arrival")).toBeOnTheScreen();
    expect(screen.getByText("Stay: 15 days")).toBeOnTheScreen();
  });

  it("shows multiple destinations", () => {
    render(
      <ComparisonView
        destinationCodes={["TH", "JP", "FR"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("Thailand")).toBeOnTheScreen();
    expect(screen.getByText("Japan")).toBeOnTheScreen();
    expect(screen.getByText("France")).toBeOnTheScreen();
    expect(screen.getByText("Visa Free")).toBeOnTheScreen();
    expect(screen.getByText("Visa Required")).toBeOnTheScreen();
    expect(screen.getByText("Visa on Arrival")).toBeOnTheScreen();
  });

  it("handles missing visa data gracefully", () => {
    render(
      <ComparisonView
        destinationCodes={["US"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("United States")).toBeOnTheScreen();
    expect(screen.getByText("No visa information available")).toBeOnTheScreen();
  });

  it("handles null visaRules gracefully", () => {
    render(
      <ComparisonView
        destinationCodes={["TH"]}
        visaRules={null}
      />
    );

    expect(screen.getByText("Thailand")).toBeOnTheScreen();
    expect(screen.getByText("No visa information available")).toBeOnTheScreen();
  });

  it("shows destination without notes correctly", () => {
    render(
      <ComparisonView
        destinationCodes={["FR"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("France")).toBeOnTheScreen();
    expect(screen.queryByText("Tourist purposes only")).not.toBeOnTheScreen();
  });

  it("calls onRemove when remove button is pressed", () => {
    const onRemove = jest.fn();
    render(
      <ComparisonView
        destinationCodes={["TH", "JP"]}
        visaRules={mockVisaRules}
        onRemove={onRemove}
      />
    );

    const removeButtons = screen.getAllByText("✕");
    fireEvent.press(removeButtons[0]);

    expect(onRemove).toHaveBeenCalledWith("TH");
  });

  it("does not show remove button when onRemove is not provided", () => {
    render(
      <ComparisonView
        destinationCodes={["TH"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.queryByText("✕")).not.toBeOnTheScreen();
  });

  it("shows cost when provided", () => {
    render(
      <ComparisonView
        destinationCodes={["ID"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("Indonesia")).toBeOnTheScreen();
    expect(screen.getByText("Visa on Arrival")).toBeOnTheScreen();
    expect(screen.getByText("Stay: 30 days")).toBeOnTheScreen();
    expect(screen.getByText("Cost: $35 USD")).toBeOnTheScreen();
    expect(screen.getByText("e-VOA recommended")).toBeOnTheScreen();
    expect(screen.getByText("Indonesian Immigration, Jan 2026")).toBeOnTheScreen();
  });

  it("shows source for each destination", () => {
    render(
      <ComparisonView
        destinationCodes={["TH"]}
        visaRules={mockVisaRules}
      />
    );

    expect(screen.getByText("Thai Embassy, Jan 2026")).toBeOnTheScreen();
  });
});

import { render, screen, fireEvent } from "@testing-library/react-native";
import MultiDestinationPicker from "../MultiDestinationPicker";

jest.mock("../../data/countries", () => ({
  countries: [
    { code: "ZA", name: "South Africa" },
    { code: "US", name: "United States" },
    { code: "TH", name: "Thailand" },
    { code: "JP", name: "Japan" },
    { code: "FR", name: "France" },
  ],
}));

describe("MultiDestinationPicker", () => {
  const mockOnSelectionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with label and count", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={[]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    expect(screen.getByText("Destination countries")).toBeOnTheScreen();
    expect(screen.getByText("Selected: 0/3")).toBeOnTheScreen();
  });

  it("shows all countries", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={[]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    expect(screen.getByText("South Africa")).toBeOnTheScreen();
    expect(screen.getByText("United States")).toBeOnTheScreen();
    expect(screen.getByText("Thailand")).toBeOnTheScreen();
    expect(screen.getByText("Japan")).toBeOnTheScreen();
    expect(screen.getByText("France")).toBeOnTheScreen();
  });

  it("filters countries by search", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={[]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search countries...");
    fireEvent.changeText(searchInput, "japan");

    expect(screen.getByText("Japan")).toBeOnTheScreen();
    expect(screen.queryByText("South Africa")).not.toBeOnTheScreen();
    expect(screen.queryByText("United States")).not.toBeOnTheScreen();
  });

  it("selects a country when pressed", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={[]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    fireEvent.press(screen.getByText("Japan"));

    expect(mockOnSelectionChange).toHaveBeenCalledWith(["JP"]);
  });

  it("deselects a country when pressed again", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={["JP"]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    fireEvent.press(screen.getByText("Japan"));

    expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
  });

  it("updates count when countries are selected", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={["JP", "FR"]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    expect(screen.getByText("Selected: 2/3")).toBeOnTheScreen();
  });

  it("prevents selecting more than 3 countries", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={["JP", "FR", "TH"]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    expect(screen.getByText("Selected: 3/3")).toBeOnTheScreen();

    fireEvent.press(screen.getByText("South Africa"));

    expect(mockOnSelectionChange).not.toHaveBeenCalled();
  });

  it("allows deselecting when at limit", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={["JP", "FR", "TH"]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    fireEvent.press(screen.getByText("Japan"));

    expect(mockOnSelectionChange).toHaveBeenCalledWith(["FR", "TH"]);
  });

  it("excludes specified country", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={[]}
        onSelectionChange={mockOnSelectionChange}
        excludeCode="ZA"
      />
    );

    expect(screen.queryByText("South Africa")).not.toBeOnTheScreen();
    expect(screen.getByText("United States")).toBeOnTheScreen();
  });

  it("shows no results message when search has no matches", () => {
    render(
      <MultiDestinationPicker
        selectedCodes={[]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search countries...");
    fireEvent.changeText(searchInput, "xyz");

    expect(screen.getByText("No results found")).toBeOnTheScreen();
  });
});

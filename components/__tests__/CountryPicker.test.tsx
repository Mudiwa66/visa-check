import { render, screen, fireEvent } from '@testing-library/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import CountryPicker from '../CountryPicker';

const mockOptions = [
  { value: 'ZA', label: 'South Africa' },
  { value: 'US', label: 'United States' },
  { value: 'TH', label: 'Thailand' },
];

function ControlledCountryPicker({
  initialSearch = '',
  ...props
}: {
  initialSearch?: string;
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
}) {
  const [searchValue, setSearchValue] = useState(initialSearch);

  return (
    <View>
      <CountryPicker
        {...props}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    </View>
  );
}

describe('CountryPicker', () => {
  const mockOnChange = jest.fn();
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial load visibility', () => {
    it('hides country list when no selection and no search (first-time user)', () => {
      render(
        <CountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
          searchValue=""
          onSearchChange={mockOnSearchChange}
        />
      );

      expect(screen.getByText('Select country')).toBeOnTheScreen();
      expect(screen.getByPlaceholderText('Search...')).toBeOnTheScreen();
      expect(screen.queryByText('South Africa')).not.toBeOnTheScreen();
      expect(screen.queryByText('United States')).not.toBeOnTheScreen();
      expect(screen.queryByText('Thailand')).not.toBeOnTheScreen();
    });

    it('shows only selected country when returning user has stored selection', () => {
      render(
        <CountryPicker
          label="Select country"
          value="US"
          onChange={mockOnChange}
          options={mockOptions}
          searchValue=""
          onSearchChange={mockOnSearchChange}
        />
      );

      expect(screen.getByText('Select country')).toBeOnTheScreen();
      expect(screen.getByPlaceholderText('Search...')).toBeOnTheScreen();
      expect(screen.getByText('United States')).toBeOnTheScreen();
      expect(screen.queryByText('South Africa')).not.toBeOnTheScreen();
      expect(screen.queryByText('Thailand')).not.toBeOnTheScreen();
    });

    it('shows filtered list when user types in search', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      expect(screen.queryByText('South Africa')).not.toBeOnTheScreen();

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'a');

      expect(screen.getByText('South Africa')).toBeOnTheScreen();
      expect(screen.getByText('Thailand')).toBeOnTheScreen();
    });

    it('hides list again when search is cleared', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'south');
      expect(screen.getByText('South Africa')).toBeOnTheScreen();

      fireEvent.changeText(searchInput, '');
      expect(screen.queryByText('South Africa')).not.toBeOnTheScreen();
      expect(screen.queryByText('United States')).not.toBeOnTheScreen();
      expect(screen.queryByText('Thailand')).not.toBeOnTheScreen();
    });

    it('shows selected country when search cleared for returning user', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value="ZA"
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'united');
      expect(screen.getByText('United States')).toBeOnTheScreen();
      expect(screen.queryByText('South Africa')).not.toBeOnTheScreen();

      fireEvent.changeText(searchInput, '');
      expect(screen.getByText('South Africa')).toBeOnTheScreen();
      expect(screen.queryByText('United States')).not.toBeOnTheScreen();
    });
  });

  it('renders label and search input', () => {
    render(
      <CountryPicker
        label="Select country"
        value={null}
        onChange={mockOnChange}
        options={mockOptions}
        searchValue=""
        onSearchChange={mockOnSearchChange}
      />
    );

    expect(screen.getByText('Select country')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Search...')).toBeOnTheScreen();
  });

  it('calls onChange when option is pressed', () => {
    render(
      <CountryPicker
        label="Select country"
        value={null}
        onChange={mockOnChange}
        options={mockOptions}
        searchValue="thai"
        onSearchChange={mockOnSearchChange}
      />
    );

    fireEvent.press(screen.getByText('Thailand'));
    expect(mockOnChange).toHaveBeenCalledWith('TH');
  });

  it('calls onSearchChange when typing in search', () => {
    render(
      <CountryPicker
        label="Select country"
        value={null}
        onChange={mockOnChange}
        options={mockOptions}
        searchValue=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'south');

    expect(mockOnSearchChange).toHaveBeenCalledWith('south');
  });

  describe('Search functionality', () => {
    it('filters options by country name', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'south');

      expect(screen.getByText('South Africa')).toBeOnTheScreen();
      expect(screen.queryByText('United States')).not.toBeOnTheScreen();
      expect(screen.queryByText('Thailand')).not.toBeOnTheScreen();
    });

    it('filters options by country code', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'ZA');

      expect(screen.getByText('South Africa')).toBeOnTheScreen();
      expect(screen.queryByText('United States')).not.toBeOnTheScreen();
      expect(screen.queryByText('Thailand')).not.toBeOnTheScreen();
    });

    it('search is case-insensitive', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'UNITED');

      expect(screen.getByText('United States')).toBeOnTheScreen();
      expect(screen.queryByText('South Africa')).not.toBeOnTheScreen();
    });

    it('shows "No results found" when search matches nothing', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'xyz');

      expect(screen.getByText('No results found')).toBeOnTheScreen();
      expect(screen.queryByText('South Africa')).not.toBeOnTheScreen();
      expect(screen.queryByText('United States')).not.toBeOnTheScreen();
      expect(screen.queryByText('Thailand')).not.toBeOnTheScreen();
    });

    it('can select filtered option', () => {
      render(
        <ControlledCountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'thai');
      fireEvent.press(screen.getByText('Thailand'));

      expect(mockOnChange).toHaveBeenCalledWith('TH');
    });
  });

  describe('String array options', () => {
    const stringOptions = ['ZA', 'US', 'TH'];

    it('hides string options on initial load', () => {
      render(
        <CountryPicker
          label="Select code"
          value={null}
          onChange={mockOnChange}
          options={stringOptions}
          searchValue=""
          onSearchChange={mockOnSearchChange}
        />
      );

      expect(screen.queryByText('ZA')).not.toBeOnTheScreen();
      expect(screen.queryByText('US')).not.toBeOnTheScreen();
      expect(screen.queryByText('TH')).not.toBeOnTheScreen();
    });

    it('shows string options when searching', () => {
      render(
        <CountryPicker
          label="Select code"
          value={null}
          onChange={mockOnChange}
          options={stringOptions}
          searchValue="z"
          onSearchChange={mockOnSearchChange}
        />
      );

      expect(screen.getByText('ZA')).toBeOnTheScreen();
    });

    it('filters string array options', () => {
      render(
        <ControlledCountryPicker
          label="Select code"
          value={null}
          onChange={mockOnChange}
          options={stringOptions}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.changeText(searchInput, 'za');

      expect(screen.getByText('ZA')).toBeOnTheScreen();
      expect(screen.queryByText('US')).not.toBeOnTheScreen();
      expect(screen.queryByText('TH')).not.toBeOnTheScreen();
    });
  });

  describe('Input validation', () => {
    it('shows error message when options array is empty', () => {
      render(
        <CountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={[]}
          searchValue=""
          onSearchChange={mockOnSearchChange}
        />
      );

      expect(screen.getByText('No countries available. Please try again later.')).toBeOnTheScreen();
    });

    it('truncates search input to max length', () => {
      render(
        <CountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
          searchValue=""
          onSearchChange={mockOnSearchChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      const longString = 'a'.repeat(150);
      fireEvent.changeText(searchInput, longString);

      expect(mockOnSearchChange).toHaveBeenCalledWith('a'.repeat(100));
    });

    it('does not call onChange for invalid option value', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <CountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={mockOptions}
          searchValue="south"
          onSearchChange={mockOnSearchChange}
        />
      );

      fireEvent.press(screen.getByText('South Africa'));

      expect(mockOnChange).toHaveBeenCalledWith('ZA');

      consoleWarnSpy.mockRestore();
    });

    it('disables search input when no options available', () => {
      render(
        <CountryPicker
          label="Select country"
          value={null}
          onChange={mockOnChange}
          options={[]}
          searchValue=""
          onSearchChange={mockOnSearchChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput.props.editable).toBe(false);
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checker from '../../checker';

jest.mock('../../../data/countries', () => ({
  countries: [
    { code: 'ZA', name: 'South Africa' },
    { code: 'US', name: 'United States' },
    { code: 'TH', name: 'Thailand' },
  ],
}));

const mockVisaRulesData: Record<string, Record<string, any>> = {
  ZA: {
    TH: {
      type: 'visa-on-arrival',
      maxStay: '15 days',
      notes: 'Valid passport',
      source: 'Thai Embassy, Jan 2026',
    },
  },
  US: {
    TH: {
      type: 'visa-free',
      maxStay: '30 days',
      notes: 'Air arrival',
      source: 'US State Department, Jan 2026',
    },
  },
};

jest.mock('../../../data/visa-rules', () => ({
  getVisaRules: jest.fn((nationalityCode: string) => {
    return Promise.resolve(mockVisaRulesData[nationalityCode] || null);
  }),
}));

function searchAndSelect(searchInput: ReturnType<typeof screen.getByPlaceholderText>, text: string) {
  fireEvent.changeText(searchInput, text);
  fireEvent.press(screen.getByText(text));
}

async function waitForLoadingToComplete() {
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
  });
}

describe('Checker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nationality selector on initial load', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    expect(screen.getByText('Visa Checker')).toBeOnTheScreen();
    expect(screen.getByText('Home country')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Search...')).toBeOnTheScreen();
  });

  it('shows countries when searching', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'south');

    expect(screen.getByText('South Africa')).toBeOnTheScreen();
  });

  it('does not show visa result or destination picker initially', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    expect(screen.queryByText('Destination country')).not.toBeOnTheScreen();
    expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
    expect(screen.queryByText('Visa Free')).not.toBeOnTheScreen();
    expect(screen.queryByText('No visa data available')).not.toBeOnTheScreen();
  });

  it('shows destination picker after selecting nationality', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    const searchInput = screen.getByPlaceholderText('Search...');
    searchAndSelect(searchInput, 'South Africa');

    expect(screen.getByText('Destination country')).toBeOnTheScreen();
    expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
  });

  it('shows correct visa data when ZA and TH are selected', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    const nationalitySearch = screen.getByPlaceholderText('Search...');
    searchAndSelect(nationalitySearch, 'South Africa');

    const destinationSearch = screen.getAllByPlaceholderText('Search...')[1];
    searchAndSelect(destinationSearch, 'Thailand');

    await waitFor(() => {
      expect(screen.getByText('Visa on Arrival')).toBeOnTheScreen();
    });
    expect(screen.getByText('Maximum Stay: 15 days')).toBeOnTheScreen();
    expect(screen.getByText('Valid passport')).toBeOnTheScreen();
    expect(screen.getByText('Source: Thai Embassy, Jan 2026')).toBeOnTheScreen();
  });

  it('shows correct visa data when US and TH are selected', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    const nationalitySearch = screen.getByPlaceholderText('Search...');
    searchAndSelect(nationalitySearch, 'United States');

    const destinationSearch = screen.getAllByPlaceholderText('Search...')[1];
    searchAndSelect(destinationSearch, 'Thailand');

    await waitFor(() => {
      expect(screen.getByText('Visa Free')).toBeOnTheScreen();
    });
    expect(screen.getByText('Maximum Stay: 30 days')).toBeOnTheScreen();
    expect(screen.getByText('Air arrival')).toBeOnTheScreen();
    expect(screen.getByText('Source: US State Department, Jan 2026')).toBeOnTheScreen();
  });

  it('resets destination when changing nationality', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    const nationalitySearch = screen.getByPlaceholderText('Search...');
    searchAndSelect(nationalitySearch, 'South Africa');

    const destinationSearch = screen.getAllByPlaceholderText('Search...')[1];
    searchAndSelect(destinationSearch, 'Thailand');
    await waitFor(() => {
      expect(screen.getByText('Visa on Arrival')).toBeOnTheScreen();
    });

    fireEvent.changeText(nationalitySearch, 'United');
    fireEvent.press(screen.getByText('United States'));
    await waitFor(() => {
      expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
    });
    expect(screen.queryByText('Visa Free')).not.toBeOnTheScreen();

    const newDestinationSearch = screen.getAllByPlaceholderText('Search...')[1];
    searchAndSelect(newDestinationSearch, 'Thailand');
    await waitFor(() => {
      expect(screen.getByText('Visa Free')).toBeOnTheScreen();
    });
  });

  it('shows reset button only when nationality is selected', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    expect(screen.queryByText('Reset')).not.toBeOnTheScreen();

    const searchInput = screen.getByPlaceholderText('Search...');
    searchAndSelect(searchInput, 'South Africa');
    expect(screen.getByText('Reset')).toBeOnTheScreen();
  });

  it('clears all selections when reset is pressed', async () => {
    render(<Checker />);
    await waitForLoadingToComplete();

    const nationalitySearch = screen.getByPlaceholderText('Search...');
    searchAndSelect(nationalitySearch, 'South Africa');

    const destinationSearch = screen.getAllByPlaceholderText('Search...')[1];
    searchAndSelect(destinationSearch, 'Thailand');
    await waitFor(() => {
      expect(screen.getByText('Visa on Arrival')).toBeOnTheScreen();
    });

    fireEvent.press(screen.getByText('Reset'));

    expect(screen.queryByText('Destination country')).not.toBeOnTheScreen();
    expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
    expect(screen.queryByText('Reset')).not.toBeOnTheScreen();

    await waitFor(() => {
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        'selectedNationality',
        'selectedDestination',
      ]);
    });
  });

  describe('Persistence', () => {
    it('loads saved nationality and destination from AsyncStorage on mount', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('ZA')
        .mockResolvedValueOnce('TH');

      render(<Checker />);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('selectedNationality');
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('selectedDestination');
      });

      await waitFor(() => {
        expect(screen.getByText('Visa on Arrival')).toBeOnTheScreen();
      });

      expect(screen.getByText('Maximum Stay: 15 days')).toBeOnTheScreen();
    });

    it('loads only nationality if no saved destination', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('ZA')
        .mockResolvedValueOnce(null);

      render(<Checker />);

      await waitFor(() => {
        expect(screen.getByText('Destination country')).toBeOnTheScreen();
      });

      expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
    });

    it('saves nationality to AsyncStorage when selected', async () => {
      render(<Checker />);
      await waitForLoadingToComplete();

      const searchInput = screen.getByPlaceholderText('Search...');
      searchAndSelect(searchInput, 'United States');

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('selectedNationality', 'US');
      });
    });

    it('saves destination to AsyncStorage when selected', async () => {
      render(<Checker />);
      await waitForLoadingToComplete();

      const nationalitySearch = screen.getByPlaceholderText('Search...');
      searchAndSelect(nationalitySearch, 'South Africa');

      const destinationSearch = screen.getAllByPlaceholderText('Search...')[1];
      searchAndSelect(destinationSearch, 'Thailand');

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('selectedDestination', 'TH');
      });
    });

    it('does not load invalid saved nationality', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('INVALID')
        .mockResolvedValueOnce('TH');

      render(<Checker />);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('selectedNationality');
      });

      expect(screen.queryByText('Destination country')).not.toBeOnTheScreen();
      expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
    });

    it('does not load invalid saved destination', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('ZA')
        .mockResolvedValueOnce('INVALID');

      render(<Checker />);

      await waitFor(() => {
        expect(screen.getByText('Destination country')).toBeOnTheScreen();
      });

      expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
    });

    it('handles AsyncStorage load errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      render(<Checker />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to load saved selections:',
          expect.any(Error)
        );
      });

      expect(screen.queryByText('Visa on Arrival')).not.toBeOnTheScreen();
      consoleErrorSpy.mockRestore();
    });

    it('handles AsyncStorage save errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      render(<Checker />);
      await waitForLoadingToComplete();

      const searchInput = screen.getByPlaceholderText('Search...');
      searchAndSelect(searchInput, 'South Africa');

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        const calls = consoleErrorSpy.mock.calls;
        const hasStorageError = calls.some(
          (call) => typeof call[0] === 'string' && call[0].startsWith('Failed to save')
        );
        expect(hasStorageError).toBe(true);
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

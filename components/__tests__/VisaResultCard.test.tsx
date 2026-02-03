import { render, screen } from '@testing-library/react-native';
import VisaResultCard from '../VisaResultCard';

describe('VisaResultCard', () => {
  it('renders visa type, max stay, and notes', () => {
    render(
      <VisaResultCard
        result={{
          type: 'visa-free',
          maxStay: '90 days',
          notes: 'Tourist purposes only',
          source: 'US State Department, Jan 2026',
        }}
      />
    );

    expect(screen.getByText('Visa Free')).toBeOnTheScreen();
    expect(screen.getByText('Maximum Stay: 90 days')).toBeOnTheScreen();
    expect(screen.getByText('Tourist purposes only')).toBeOnTheScreen();
    expect(screen.getByText('Source: US State Department, Jan 2026')).toBeOnTheScreen();
  });

  it('renders without notes when not provided', () => {
    render(
      <VisaResultCard
        result={{
          type: 'e-visa',
          maxStay: '30 days',
          source: 'Embassy, Jan 2026',
        }}
      />
    );

    expect(screen.getByText('E-Visa Required')).toBeOnTheScreen();
    expect(screen.getByText('Maximum Stay: 30 days')).toBeOnTheScreen();
    expect(screen.getByText('Source: Embassy, Jan 2026')).toBeOnTheScreen();
  });

  it('renders cost when provided', () => {
    render(
      <VisaResultCard
        result={{
          type: 'visa-on-arrival',
          maxStay: '30 days',
          cost: '$35 USD',
          notes: 'e-VOA recommended',
          source: 'Indonesian Immigration, Jan 2026',
        }}
      />
    );

    expect(screen.getByText('Visa on Arrival')).toBeOnTheScreen();
    expect(screen.getByText('Maximum Stay: 30 days')).toBeOnTheScreen();
    expect(screen.getByText('Cost: $35 USD')).toBeOnTheScreen();
    expect(screen.getByText('e-VOA recommended')).toBeOnTheScreen();
    expect(screen.getByText('Source: Indonesian Immigration, Jan 2026')).toBeOnTheScreen();
  });

  describe('Error handling', () => {
    it('handles missing maxStay gracefully', () => {
      render(
        <VisaResultCard
          result={{
            type: 'visa-free',
            maxStay: '',
            source: 'Embassy, Jan 2026',
          }}
        />
      );

      expect(screen.getByText('Maximum Stay: Not specified')).toBeOnTheScreen();
    });

    it('handles missing source gracefully', () => {
      render(
        <VisaResultCard
          result={{
            type: 'visa-free',
            maxStay: '30 days',
            source: '',
          }}
        />
      );

      expect(screen.getByText('Source: Source not available')).toBeOnTheScreen();
    });

    it('handles invalid visa type gracefully', () => {
      render(
        <VisaResultCard
          result={{
            type: 'invalid-type' as any,
            maxStay: '30 days',
            source: 'Embassy, Jan 2026',
          }}
        />
      );

      expect(screen.getByText('Unknown Visa Type')).toBeOnTheScreen();
    });

    it('handles null result gracefully', () => {
      render(<VisaResultCard result={null as any} />);

      expect(screen.getByText('Unable to display visa information')).toBeOnTheScreen();
    });
  });
});

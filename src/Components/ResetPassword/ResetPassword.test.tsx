import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ResetPassword from './ResetPassword';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ResetPassword component', () => {
  test('validates password input correctly', () => {
        render(
          <Router>
            <ResetPassword />
          </Router>
        );
        const phoneInput = screen.getByPlaceholderText('New Password');
        const submitButton = screen.getByText('Submit');
    
        fireEvent.change(phoneInput, { target: { value: 'test12345' } });
        fireEvent.click(submitButton);
        expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
    });

    test('validates confirm password input correctly', () => {
        render(
          <Router>
            <ResetPassword />
          </Router>
        );
        const phoneInput = screen.getByPlaceholderText('Confirm Password');
        const submitButton = screen.getByText('Submit');
    
        fireEvent.change(phoneInput, { target: { value: 'test12345' } });
        fireEvent.click(submitButton);
        expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
    });


})
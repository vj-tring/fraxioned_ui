
import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader component', () => {
  it('renders correctly', () => {
    const { getAllByClassName } = render(<Loader />);
    expect(getAllByClassName('loader-container')).toHaveLength(1);
    expect(getAllByClassName('loader')).toHaveLength(1);
  });

  it('has the correct CSS classes', () => {
    const { getAllByClassName } = render(<Loader />);
    expect(getAllByClassName('loader-container')[0]).toHaveClass('loader-container');
    expect(getAllByClassName('loader')[0]).toHaveClass('loader');
  });
});
import { ThemeProvider } from '@primer/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';

import ThemeSelector, { ThemeSwitcher } from 'interface/components/ThemeSelector';

describe('ThemeSelector', () => {
  it('includes text-mode labels in the server-rendered icon buttons', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <ThemeProvider colorMode="light">
        <ThemeSelector />
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const labels = ['Tema escuro', 'Tema claro', 'Alternar tema entre "claro" e "escuro"'];

    for (const label of labels) {
      const button = container.querySelector(`button[title='${label}']`);
      expect(button).not.toBeNull();
      expect(button).toHaveAttribute('value', label);
    }
  });

  it('preserves theme switching and the text-mode label after clicking', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider colorMode="light">
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', { name: 'Alternar tema entre "claro" e "escuro"' });
    await user.click(button);

    expect(localStorage.getItem('colorMode')).toBe('dark');
    expect(button).toHaveAttribute('value', 'Alternar tema entre "claro" e "escuro"');

    await user.click(button);
    expect(localStorage.getItem('colorMode')).toBe('light');
    localStorage.removeItem('colorMode');
  });
});

import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/globals.css';
import { ThemeProvider } from '../src/components/theme-provider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: undefined, // This will use the default theme
    },
  },
  decorators: [
    (Story, context) => {
      // Get the current theme mode from Storybook's globals
      const mode = context.globals.theme === 'dark' ? 'dark' : 'light';

      // Add the font-sans CSS variable that Tailwind expects
      // You can customize this to use your preferred font stack
      React.useEffect(() => {
        document.documentElement.style.setProperty(
          '--font-sans',
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        );
      }, []);

      return (
        <ThemeProvider defaultTheme="default" defaultMode={mode}>
          <div className="min-h-screen bg-background text-foreground">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

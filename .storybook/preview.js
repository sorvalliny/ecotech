import '../design-system.css';
import '../design-system/components/status-badge.css';
import '../design-system/components/product-card.css';
import '../design-system/components/tooltip.css';

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo"
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (story) => {
      const wrapper = document.createElement('div');
      wrapper.style.fontFamily = "'Exo 2', sans-serif";
      wrapper.style.padding = '20px';
      const result = story();
      if (typeof result === 'string') {
        wrapper.innerHTML = result;
      } else {
        wrapper.appendChild(result);
      }
      return wrapper;
    },
  ],
};

export default preview;

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';

// Import all the stores and their initial states
import useProjectStore from '../store/projectStore';
import useEntityStore from '../store/entityStore';
import useRelationshipStore from '../store/relationshipStore';
import useTemplateStore from '../store/templateStore';
import useThemeStore from '../store/themeStore';
import useGraphStore from '../store/graphStore';
import useStoryEventStore from '../store/storyEventStore';

import type { DeepPartial } from '../types/utils';

// Get the initial state of each store
const projectInitialState = useProjectStore.getState();
const entityInitialState = useEntityStore.getState();
const relationshipInitialState = useRelationshipStore.getState();
const templateInitialState = useTemplateStore.getState();
const themeInitialState = useThemeStore.getState();
const graphInitialState = useGraphStore.getState();
const storyEventInitialState = useStoryEventStore.getState();

// Define the shape of the preloaded state
type PreloadedState = {
  project?: DeepPartial<typeof projectInitialState>;
  entity?: DeepPartial<typeof entityInitialState>;
  relationship?: DeepPartial<typeof relationshipInitialState>;
  template?: DeepPartial<typeof templateInitialState>;
  theme?: DeepPartial<typeof themeInitialState>;
  graph?: DeepPartial<typeof graphInitialState>;
  storyEvent?: DeepPartial<typeof storyEventInitialState>;
};

// Create a custom render function
const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    ...renderOptions
  }: { preloadedState?: PreloadedState } & Omit<RenderOptions, 'wrapper'> = {}
) => {
  // Reset all stores to their initial state before each test
  useProjectStore.setState(projectInitialState, true);
  useEntityStore.setState(entityInitialState, true);
  useRelationshipStore.setState(relationshipInitialState, true);
  useTemplateStore.setState(templateInitialState, true);
  useThemeStore.setState(themeInitialState, true);
  useGraphStore.setState(graphInitialState, true);
  useStoryEventStore.setState(storyEventInitialState, true);

  // Set up the stores with preloaded state
  if (preloadedState.project) {
    useProjectStore.setState({ ...useProjectStore.getState(), ...preloadedState.project });
  }
  if (preloadedState.entity) {
    useEntityStore.setState({ ...useEntityStore.getState(), ...preloadedState.entity });
  }
  if (preloadedState.relationship) {
    useRelationshipStore.setState({ ...useRelationshipStore.getState(), ...preloadedState.relationship });
  }
  if (preloadedState.template) {
    useTemplateStore.setState({ ...useTemplateStore.getState(), ...preloadedState.template });
  }
  if (preloadedState.theme) {
    useThemeStore.setState({ ...useThemeStore.getState(), ...preloadedState.theme });
  }
  if (preloadedState.graph) {
    useGraphStore.setState({ ...useGraphStore.getState(), ...preloadedState.graph });
  }
  if (preloadedState.storyEvent) {
    useStoryEventStore.setState({ ...useStoryEventStore.getState(), ...preloadedState.storyEvent });
  }

  const theme = createTheme();

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider theme={theme}>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { renderWithProviders };

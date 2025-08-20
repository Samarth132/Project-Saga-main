import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock the global Image object to prevent network errors in tests
Object.defineProperty(global.window, 'Image', {
  writable: true,
  value: class Image {
    onload: () => void = () => {};
    src: string = '';
    constructor() {
      setTimeout(() => {
        this.onload();
      }, 10);
      return this;
    }
  },
});

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ projectId: 'mock-project-id' }), // Default mock params
  };
});

// Mock all services
vi.mock('../services/projectService.ts', () => import('./mocks/projectService'));
vi.mock('../services/entityService.ts', () => import('./mocks/entityService'));
vi.mock('../services/relationshipService.ts', () => import('./mocks/relationshipService'));
vi.mock('../services/templateService.ts', () => import('./mocks/templateService'));
vi.mock('../services/graphService.ts', () => import('./mocks/graphService'));
vi.mock('../services/storyEventService.ts', () => import('./mocks/storyEventService'));

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

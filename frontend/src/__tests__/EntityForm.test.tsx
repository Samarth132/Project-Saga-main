import { render, screen, fireEvent } from '@testing-library/react';
import EntityForm from '../components/EntityForm';
import useTemplateStore from '../store/templateStore';
import { MemoryRouter } from 'react-router-dom';
import type { Template } from '../types/template';
import { vi } from 'vitest';

vi.mock('../services/templateService.ts', () => ({}));

const mockTemplates: Template[] = [
  {
    _id: 't1',
    name: 'Character',
    fields: [
      { name: 'Age', type: 'number' },
      { name: 'Bio', type: 'text' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const mockFetchTemplates = vi.fn();

describe('EntityForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTemplateStore.setState({
      templates: mockTemplates,
      loading: false,
      error: null,
      fetchTemplates: mockFetchTemplates,
    });
  });

  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  it('renders a template dropdown and fetches templates', () => {
    render(
      <EntityForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(mockFetchTemplates).toHaveBeenCalled();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
  });

  it('shows dynamic fields when a template is selected', async () => {
    render(
      <EntityForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Open the select dropdown
    const select = screen.getByLabelText('Type');
    fireEvent.mouseDown(select);

    // Select the 'Character' template
    const option = await screen.findByText('Character');
    fireEvent.click(option);

    // Check if the fields from the template are rendered
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
  });

  it('submits the correct data structure based on the template', async () => {
    render(
      <EntityForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Aragorn' } });

    // Select template
    const select = screen.getByLabelText('Type');
    fireEvent.mouseDown(select);
    const option = await screen.findByText('Character');
    fireEvent.click(option);

    // Fill out dynamic fields
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '87' } });
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'Heir of Isildur' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Aragorn',
      type: 'Character',
      data: {
        Age: '87',
        Bio: 'Heir of Isildur',
      },
    });
  });
});

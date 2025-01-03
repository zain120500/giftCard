import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GiftCard from '../app/pages/GiftCard'; 
import '@testing-library/jest-dom';
import html2canvas from 'html2canvas-pro';  
import userEvent from '@testing-library/user-event';

jest.mock('html2canvas-pro', () => {
  return jest.fn(() => Promise.resolve({
      toDataURL: jest.fn(() => 'data:image/png;base64,mockedImage'),
  }));
});
describe('GiftCard', () => {
  test('renders GiftCard component', () => {
    render(<GiftCard />);

    expect(screen.getByText('Gift Card')).toBeInTheDocument();
  });

  test('should show validation errors when form is not filled', async () => {
    render(<GiftCard />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText('Dear is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
      expect(screen.getByText('From is required')).toBeInTheDocument();
      expect(screen.getByText('Image is required')).toBeInTheDocument();
    });
  });

  test('should allow input change for Dear, Message, and From', () => {
    render(<GiftCard />);

    const dearInput = screen.getByText(/Dear/i).nextElementSibling as HTMLInputElement | null;
    const messageInput = screen.getByText(/Message/i).nextElementSibling as HTMLInputElement | null;
    const fromInput = screen.getByText(/From/i).nextElementSibling as HTMLInputElement | null;
    
    if (dearInput && messageInput && fromInput) {
      fireEvent.change(dearInput, { target: { value: 'John' } });
      fireEvent.change(messageInput, { target: { value: 'Happy Birthday!' } });
      fireEvent.change(fromInput, { target: { value: 'Jane' } });
    } else {
      throw new Error('Input fields not found');
    }
    
    expect(dearInput).toHaveValue('John');
    expect(messageInput).toHaveValue('Happy Birthday!');
    expect(fromInput).toHaveValue('Jane');
  });

  test('should show uploaded image and trigger download', async () => {
    render(<GiftCard />);
  
    const fileInput = screen.getByTestId('file-upload');
    const file = new File(['image content'], 'image.png', { type: 'image/png' });
  
    await userEvent.upload(fileInput, file);
  
    const uploadedImage = await screen.findByAltText('Uploaded');
    expect(uploadedImage).toBeInTheDocument();
  
    const dearInput = screen.getByTestId('dearInput');
    const messageInput = screen.getByTestId('messageInput');
    const fromInput = screen.getByTestId('fromInput');
    
    fireEvent.change(dearInput, { target: { value: 'John' } });
    fireEvent.change(messageInput, { target: { value: 'Happy Birthday!' } });
    fireEvent.change(fromInput, { target: { value: 'Jane' } });
  
    const downloadButton = screen.getByRole('button', { name: /download/i });
    expect(downloadButton).toBeInTheDocument();
  
    fireEvent.click(downloadButton);
  
    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalled();
    });
  
    expect(html2canvas).toHaveBeenCalledWith(expect.anything());
  });


  test('should validate image file upload', async () => {
    render(<GiftCard />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

   
    const imageError = await screen.findByText('Image is required');
    expect(imageError).toBeInTheDocument();

    const fileInput = screen.getByTestId('file-upload');
    const file = new File(['image content'], 'image.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
        expect(screen.queryByText('Image is required')).toBeNull();
    });

    const uploadedImage = await screen.findByAltText('Uploaded');
    expect(uploadedImage).toBeInTheDocument();
});

});

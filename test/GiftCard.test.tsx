// GiftCard.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GiftCard from '../app/pages/GiftCard'; // Adjust the path based on your project structure

import '@testing-library/jest-dom';
import html2canvas from 'html2canvas-pro';  // Make sure you're importing the correct module
import userEvent from '@testing-library/user-event';

// Mock html2canvas
jest.mock('html2canvas-pro', () => {
  return jest.fn(() => Promise.resolve({
      toDataURL: jest.fn(() => 'data:image/png;base64,mockedImage'),
  }));
});
describe('GiftCard', () => {
  test('renders GiftCard component', () => {
    render(<GiftCard />);

    // Check if "Gift Card" header is rendered
    expect(screen.getByText('Gift Card')).toBeInTheDocument();
  });

  test('should show validation errors when form is not filled', async () => {
    render(<GiftCard />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    
    fireEvent.click(downloadButton);

    // Check if the validation errors for 'dear', 'message', 'from', and 'image' are displayed
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
    
    // Memastikan bahwa input ditemukan sebelum mencoba untuk memicu event
    if (dearInput && messageInput && fromInput) {
      fireEvent.change(dearInput, { target: { value: 'John' } });
      fireEvent.change(messageInput, { target: { value: 'Happy Birthday!' } });
      fireEvent.change(fromInput, { target: { value: 'Jane' } });
    } else {
      throw new Error('Input fields not found');
    }
    
    // Check if the values are correctly updated
    expect(dearInput).toHaveValue('John');
    expect(messageInput).toHaveValue('Happy Birthday!');
    expect(fromInput).toHaveValue('Jane');
  });

  test('should show uploaded image and trigger download', async () => {
    render(<GiftCard />);
  
    // Simulate the file upload
    const fileInput = screen.getByTestId('file-upload');
    const file = new File(['image content'], 'image.png', { type: 'image/png' });
  
    // Fire change event to simulate file upload
    await userEvent.upload(fileInput, file);
  
    // Wait for the image to be displayed
    const uploadedImage = await screen.findByAltText('Uploaded');
    expect(uploadedImage).toBeInTheDocument();
  
    // Fill in the form fields to pass validation
    const dearInput = screen.getByTestId('dearInput');
    const messageInput = screen.getByTestId('messageInput');
    const fromInput = screen.getByTestId('fromInput');
    
    fireEvent.change(dearInput, { target: { value: 'John' } });
    fireEvent.change(messageInput, { target: { value: 'Happy Birthday!' } });
    fireEvent.change(fromInput, { target: { value: 'Jane' } });
  
    // Check if the download button is displayed
    const downloadButton = screen.getByRole('button', { name: /download/i });
    expect(downloadButton).toBeInTheDocument();
  
    // Simulate the click on the download button
    fireEvent.click(downloadButton);
  
    // Wait for the download to be triggered
    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalled();
    });
  
    // Check if the mock canvas function was called
    expect(html2canvas).toHaveBeenCalledWith(expect.anything());
  });

  
  test('should validate image file upload', async () => {
    render(<GiftCard />);

    // Trigger the download without uploading an image
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    // Check for the error message
    const imageError = await screen.findByText('Image is required');
    expect(imageError).toBeInTheDocument();

    // Simulate file upload
    const fileInput = screen.getByTestId('file-upload');
    const file = new File(['image content'], 'image.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);

    // Wait for the error message to disappear
    await waitFor(() => {
        expect(screen.queryByText('Image is required')).toBeNull();
    });

    // Check if the uploaded image is displayed
    const uploadedImage = await screen.findByAltText('Uploaded');
    expect(uploadedImage).toBeInTheDocument();
});

});

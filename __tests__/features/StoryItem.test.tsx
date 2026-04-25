import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StoryItem } from '../../src/features/feed/StoryItem';
import type { Story } from '../../src/types/story';

describe('StoryItem', () => {
  const mockStory: Story = {
    id: 12345,
    title: 'Test Story Title for HackerFeed',
    url: 'https://example.com/test-article',
    domain: 'example.com',
    by: 'testuser',
    score: 142,
    time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('should render the story title', () => {
    const { getByText } = render(
      <StoryItem story={mockStory} onPress={mockOnPress} />,
    );

    expect(getByText('Test Story Title for HackerFeed')).toBeTruthy();
  });

  it('should render the domain', () => {
    const { getByText } = render(
      <StoryItem story={mockStory} onPress={mockOnPress} />,
    );

    expect(getByText('example.com')).toBeTruthy();
  });

  it('should render the score', () => {
    const { getByText } = render(
      <StoryItem story={mockStory} onPress={mockOnPress} />,
    );

    expect(getByText('▲ 142')).toBeTruthy();
  });

  it('should call onPress with the story when tapped', () => {
    const { getByTestId } = render(
      <StoryItem story={mockStory} onPress={mockOnPress} />,
    );

    const storyItem = getByTestId(`story-item-${mockStory.id}`);
    fireEvent.press(storyItem);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockStory);
  });

  it('should not call onPress when not tapped', () => {
    render(<StoryItem story={mockStory} onPress={mockOnPress} />);

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});

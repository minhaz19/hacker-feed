import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useDebounce } from '../../hooks/useAppHooks';
import { useFeedStore } from '../../store/feedStore';

export const SearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const setSearchQuery = useFeedStore(state => state.setSearchQuery);
  const debouncedValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search color="#636366" size={16} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search stories..."
          placeholderTextColor="#636366"
          value={inputValue}
          onChangeText={setInputValue}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          testID="search-input"
        />
        {inputValue.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <X color="#8E8E93" size={16} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});

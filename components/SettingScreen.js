import React from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';
import { useTheme } from './Theme';
import ContainerWrapper from './ContainerWrapper';

const SettingScreen = () => {
  const { isDarkTheme, toggleTheme, colors } = useTheme();

  return (
    <ContainerWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.trackFalse, true: colors.trackTrue }}
          thumbColor={isDarkTheme ? colors.thumbTrue : colors.thumbFalse}
        />
      </View>
    </ContainerWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SettingScreen;

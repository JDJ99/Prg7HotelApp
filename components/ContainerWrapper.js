import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from './Theme'

export default function ContainerWrapper({children}) {
    const {colors} = useTheme()
    return (
        <View style={[styles.container,{backgroundColor: colors.bgColor}]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
      },
})
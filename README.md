# React Native Sliding Button

A customizable slide-to-execute button for React Native applications.

## Installation

You can install the package using npm:

```bash
npm install slide-button-with-threshold
```

Make sure to also install the required peer dependencies if they are not already included in your project:

```bash
npm install react-native-gesture-handler react react-native
```

## How to Use the Package

Import the necessary components from React Native and your package. Here's an example of how to implement the sliding button:

```javascript
import React from 'react';
import { Alert, SafeAreaView } from 'react-native';
import SlideToPayButton from 'slide-button-with-threshold';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
    const handleActionComplete = () => {
        Alert.alert('Action completed!');
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <GestureHandlerRootView>
                <SlideToPayButton
                    onComplete={handleActionComplete}
                    // Optionally customize the button with the following props:
                    // text="Slide to Execute" // Custom label
                    // threshold={0.7} // Custom threshold
                    // sliderWidth={300} // Custom slider width
                    // sliderHeight={70} // Custom slider height
                />
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default App;
```

### Props

- **`text`** *(string)*: Custom label for the button (default: "Slide to Execute").
- **`threshold`** *(number)*: Percentage of slider width to reach for action completion (default: `0.7`).
- **`sliderWidth`** *(number)*: Width of the slider (default: `300`).
- **`sliderHeight`** *(number)*: Height of the slider (default: `70`).
- **`onComplete`** *(function)*: Callback function to be called when the action is completed.

Feel free to customize the props to fit your design requirements!

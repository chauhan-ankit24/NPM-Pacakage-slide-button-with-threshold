import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Alert, Image } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Shimmering from './shimmer';

interface SlideToPayButtonProps {
    onComplete: () => void;
    text?: string; // Custom text for the button
    threshold?: number; // Custom threshold for payment completion
    sliderWidth?: number; // Custom width for the slider
    sliderHeight?: number; // Custom height for the slider
}

const SlideToPayButton: React.FC<SlideToPayButtonProps> = ({
    onComplete,
    text = 'Slide to Pay | ₹220', // Default text
    threshold = 0.7, // Default threshold (70%)
    sliderWidth,
    sliderHeight = 70, // Default height
}) => {
    const { width } = Dimensions.get('window');
    const SLIDER_WIDTH = sliderWidth || width * 0.91; // Use custom width or default
    const THUMB_WIDTH = 55; // Width of the draggable thumb
    const PAYMENT_THRESHOLD = threshold * (SLIDER_WIDTH - THUMB_WIDTH); // Custom threshold

    const translationX = useState(new Animated.Value(0))[0];
    const bounceAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(1))[0];
    const [showCheck, setShowCheck] = useState(false);
    const opacityAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        const bounce = Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 9,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        );

        bounce.start();

        return () => {
            bounce.stop();
        };
    }, [bounceAnim]);

    const handleGesture = Animated.event(
        [{ nativeEvent: { translationX } }],
        { useNativeDriver: true }
    );

    const handleStateChange = (event: any) => {
        if (event.nativeEvent.state === State.BEGAN) {
            bounceAnim.stopAnimation();
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
        }

        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationX > PAYMENT_THRESHOLD) {
                onComplete();

                setTimeout(() => {
                    Animated.spring(translationX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                    bounceAnim.setValue(0);
                    setShowCheck(false);
                    opacityAnim.setValue(1);

                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(bounceAnim, {
                                toValue: 0,
                                duration: 1200,
                                useNativeDriver: true,
                            }),
                            Animated.timing(bounceAnim, {
                                toValue: 16,
                                duration: 500,
                                useNativeDriver: true,
                            }),
                            Animated.timing(bounceAnim, {
                                toValue: 0,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                        ])
                    ).start();
                }, 1000);
            } else {
                Animated.spring(translationX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
                bounceAnim.setValue(0);
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(bounceAnim, {
                            toValue: 0,
                            duration: 1200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(bounceAnim, {
                            toValue: 16,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(bounceAnim, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            }
        }
    };

    useEffect(() => {
        const listenerId = translationX.addListener(({ value }) => {
            if (value > PAYMENT_THRESHOLD) {
                setShowCheck(true);
            } else {
                setShowCheck(false);
            }

            if (value < PAYMENT_THRESHOLD) {
                const opacity = 1 - (value / PAYMENT_THRESHOLD);
                opacityAnim.setValue(opacity);
            } else {
                const opacity = (SLIDER_WIDTH - value) / (SLIDER_WIDTH - PAYMENT_THRESHOLD);
                opacityAnim.setValue(opacity < 1 ? opacity : 1);
            }

            if (value > PAYMENT_THRESHOLD) {
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }).start();
            }
        });

        return () => {
            translationX.removeListener(listenerId);
        };
    }, [translationX, opacityAnim]);

    return (
        <Animated.View style={[styles.container, { width: SLIDER_WIDTH, height: sliderHeight, transform: [{ scale: scaleAnim }] }]}>
            <Shimmering wrapperStyle={{
                width: SLIDER_WIDTH,
                height: sliderHeight,
                borderRadius: 40,
            }} />
            <Animated.Text style={[styles.label, { opacity: opacityAnim }]}>
                {text} {/* Use the custom text prop */}
            </Animated.Text>

            <PanGestureHandler
                onGestureEvent={handleGesture}
                onHandlerStateChange={handleStateChange}
            >
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            transform: [
                                {
                                    translateX: translationX.interpolate({
                                        inputRange: [0, SLIDER_WIDTH - THUMB_WIDTH],
                                        outputRange: [0, SLIDER_WIDTH - THUMB_WIDTH],
                                        extrapolate: 'clamp',
                                    }),
                                },
                                {
                                    translateX: bounceAnim,
                                },
                            ],
                        },
                    ]}
                >
                    {showCheck ? (
                        <Image
                            source={require('../assets/check.png')}
                            style={styles.arrowImage}
                        />
                    ) : (
                        <Image
                            source={require('../assets/arrow.png')}
                            style={styles.arrowImage}
                        />
                    )}
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#159F6C',
        borderRadius: 40,
        justifyContent: 'center',
        position: 'relative',
        zIndex: 5,
    },
    label: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 1,
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    thumb: {
        width: 55,
        height: 55,
        borderRadius: 30,
        position: 'absolute',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 2,
    },
    arrowImage: {
        width: '70%',
        height: '70%',
        resizeMode: 'contain',
        position: 'absolute',
        backgroundColor: 'transparent',
    },
});

export default SlideToPayButton;

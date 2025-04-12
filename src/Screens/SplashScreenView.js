import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Rect, Circle, Path, Text } from 'react-native-svg';

const { width, height } = Dimensions.get('window'); // Récupérer les dimensions de l'écran

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid meet">
        {/* Fond */}
        <Rect width="360" height="640" fill="#f8fafc" />

        {/* Cercle bleu */}
        <Circle cx="180" cy="270" r="80" fill="#3b82f6" />

        {/* Croix blanche */}
        <Path
          d="M150 270 L220 270 M185 230 L185 310"
          stroke="white"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Texte "TipShare" */}
        <Text
          x="180"
          y="380"
          fontFamily="Arial"
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          fill="#1e3a8a"
        >
          TipzMe
        </Text>

        {/* Animation des cercles */}
        <Circle cx="150" cy="430" r="6" fill="#3b82f6" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0s"
          />
        </Circle>
        <Circle cx="180" cy="430" r="6" fill="#3b82f6" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </Circle>
        <Circle cx="210" cy="430" r="6" fill="#3b82f6" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            repeatCount="indefinite"
            begin="1s"
          />
        </Circle>

        {/* Texte "Chargement des données..." */}
        <Text
          x="180"
          y="470"
          fontFamily="Arial"
          fontSize="14"
          textAnchor="middle"
          fill="#64748b"
        >
          Chargement des données...
        </Text>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend toute la hauteur disponible
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Prend toute la largeur disponible
    height: '100%', // Prend toute la hauteur disponible
  },
});
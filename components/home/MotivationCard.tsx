import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandSignatureText } from '@/components/BrandTitleText';
import { MOTIVATION_HEIGHT } from '@/lib/homeLayout';
import { DASHBOARD } from '@/lib/dashboardDefaults';

export function MotivationCard() {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['#070B12', '#0c0a14', 'rgba(88,28,135,0.35)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.quote} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.8}>
          {DASHBOARD.quote}
        </Text>
        <BrandSignatureText />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: MOTIVATION_HEIGHT,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  quoteMark: {
    color: '#A855F7',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 18,
    marginBottom: 2,
    textAlign: 'center',
  },
  quote: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 15,
    textAlign: 'center',
    width: '100%',
  },
});

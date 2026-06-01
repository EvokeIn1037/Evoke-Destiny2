import type { CSSProperties } from 'react';
import finalShapeVideo from '@/presentation/assets/video/The_Final_Shape.mp4';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

export default function HomePage() {
  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.hero}>
        <h1 style={styles.title}>evoke's destiny finder</h1>
        <p style={styles.subtitle}>应该会有各种个人数据、武器数据查询吧~</p>
      </div>
      <div style={styles.videoWrapper}>
        <video
          src={finalShapeVideo}
          style={styles.video}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <Footer />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    backgroundColor: colors.bg,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  hero: {
    backgroundColor: colors.bgCard,
    borderBottom: `1px solid ${colors.border}`,
    padding: `${spacing.xxl} ${spacing.lg}`,
    textAlign: 'left',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  title: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.md,
  },
  videoWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: `${spacing.lg} auto`,
    padding: `0 ${spacing.lg}`,
  },
  video: {
    width: '100%',
    display: 'block',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
  },
};

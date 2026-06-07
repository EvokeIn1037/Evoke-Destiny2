import { useEffect, useRef, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import finalShapeVideo from '@/presentation/assets/video/The_Final_Shape.mp4';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

export default function HomePage() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.hero}>
        <h1 style={styles.title}>{t('home.title')}</h1>
        <p style={styles.subtitle}>{t('home.subtitle')}</p>
      </div>
      <div style={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={finalShapeVideo}
          style={styles.video}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Destiny 2: The Final Shape 宣传视频"
        />
      </div>
      <Footer />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    backgroundColor: colors.bg,
    minHeight: '100dvh',
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
    fontSize: `clamp(${fontSizes.xl}, 5vw, ${fontSizes.xxl})`,
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
    maxHeight: '70vh',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
  },
};

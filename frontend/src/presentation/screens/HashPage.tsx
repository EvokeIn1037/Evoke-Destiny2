import { useState, type CSSProperties } from 'react';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import { lookupHash, type HashResult } from '@/data/services/hashService';
import { useAsync } from '@/shared/hooks/useAsync';
import { colors, spacing, fontSizes, font, radii, inputStyle, buttonStyle, surfaceStyle } from '@/presentation/styles/tokens';

export default function HashPage() {
  const [hashValue, setHashValue] = useState('');
  const { status, data, error, run } = useAsync<HashResult>();

  const handleSearch = () => {
    const trimmed = hashValue.trim();
    if (!trimmed) return;
    run(lookupHash(trimmed));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const iconUrl = data?.iconPath ? `https://www.bungie.net${data.iconPath}` : null;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.main}>
        <h2 style={styles.pageTitle}>hash查询</h2>
        <div style={styles.card}>
          <div style={styles.inputRow}>
            <input
              style={inputStyle}
              type="text"
              placeholder="hash值"
              value={hashValue}
              onChange={(e) => setHashValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              style={{ ...buttonStyle, opacity: status === 'loading' ? 0.6 : 1 }}
              onClick={handleSearch}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? '查询中...' : '确认'}
            </button>
          </div>
        </div>
        {status === 'error' && error && (
          <p style={styles.error}>{error}</p>
        )}
        {status === 'success' && data && (
          <div style={styles.resultCard}>
            <div style={styles.resultRow}>
              {iconUrl && <img style={styles.icon} src={iconUrl} alt="" />}
              <div>
                <p style={styles.resultName}>{data.name}</p>
                <p style={styles.resultType}>{data.type}</p>
              </div>
            </div>
          </div>
        )}
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
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.xl,
    width: '100%',
  },
  pageTitle: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  card: {
    ...surfaceStyle,
    marginBottom: spacing.lg,
  },
  inputRow: {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    fontFamily: font.family,
    fontSize: fontSizes.md,
    padding: spacing.md,
  },
  resultCard: {
    ...surfaceStyle,
    marginTop: spacing.md,
  },
  resultRow: {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'center',
  },
  icon: {
    width: '64px',
    height: '64px',
    borderRadius: radii.sm,
  },
  resultName: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    margin: 0,
  },
  resultType: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.base,
    margin: 0,
    marginTop: spacing.xs,
  },
};

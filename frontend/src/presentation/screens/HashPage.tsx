import { useState, type CSSProperties } from 'react';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import { colors, spacing, fontSizes, font, inputStyle, buttonStyle, surfaceStyle } from '@/presentation/styles/tokens';

export default function HashPage() {
  const [hashValue, setHashValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmed = hashValue.trim();
    if (!trimmed) return;
    setStatus('loading');
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/hash/hash.php?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      setResult(text);
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
      setStatus('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

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
        {result !== null && (
          <div style={styles.resultCard}>
            <pre style={styles.result}>{result}</pre>
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
    minHeight: '100vh',
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
  result: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.base,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    margin: 0,
  },
};

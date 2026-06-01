import { useState, type CSSProperties } from 'react';
import { colors, spacing, inputStyle, buttonStyle } from '@/presentation/styles/tokens';

interface Props {
  onSearch: (name: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Bungie昵称 (输入包括#后的内容)',
  loading = false,
}: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <div style={styles.wrapper}>
      <input
        style={{
          ...inputStyle,
          ...styles.input,
          borderColor: loading ? colors.border : undefined,
          opacity: loading ? 0.7 : 1,
        }}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
        placeholder={placeholder}
        disabled={loading}
      />
      <button
        style={{
          ...buttonStyle,
          opacity: loading ? 0.7 : 1,
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? '查询中...' : '确认'}
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    gap: spacing.sm,
    maxWidth: '480px',
  },
  input: {
    flex: 1,
    minWidth: 0,
  },
};

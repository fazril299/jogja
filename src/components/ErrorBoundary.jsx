import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAF8F5',
            color: '#2C221E',
            padding: '2rem',
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            textAlign: 'center'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              border: '1px solid #EAE4DC',
              boxShadow: '0 12px 36px rgba(44, 34, 30, 0.08)'
            }}
          >
            <div style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>🏛️</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.6rem', color: '#2C221E' }}>
              Memulihkan Tampilan Budaya Jogja
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6E5D52', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Terjadi penyesuaian saat memuat data tampilan cagar budaya. Silakan klik tombol di bawah untuk memuat ulang tampilan dengan lancar.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (this.props.onReset) this.props.onReset();
                  else window.location.reload();
                }}
                style={{
                  padding: '0.75rem 1.6rem',
                  borderRadius: '999px',
                  backgroundColor: '#2C221E',
                  color: '#FAF8F5',
                  border: '1.5px solid #C99B52',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(44, 34, 30, 0.15)'
                }}
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

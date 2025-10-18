import React from 'react';
import './LoadingSpinner.css';

// ======================= 🔄 COMPONENTE DE LOADING ==========================
export const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Cargando...',
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  };

  const colorClasses = {
    primary: 'loading-spinner-primary',
    secondary: 'loading-spinner-secondary',
    white: 'loading-spinner-white'
  };

  const spinner = (
    <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <div className="loading-spinner-circle">
        <div className="loading-spinner-inner"></div>
      </div>
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-spinner-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// ======================= 🔄 LOADING PARA BOTONES ==========================
export const ButtonLoading = ({ loading, children, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading && <LoadingSpinner size="small" text="" />}
      {!loading && children}
    </button>
  );
};

// ======================= 🔄 LOADING PARA PÁGINAS ==========================
export const PageLoading = ({ message = 'Cargando página...' }) => {
  return (
    <div className="page-loading">
      <LoadingSpinner size="large" text={message} />
    </div>
  );
};

// ======================= 🔄 LOADING PARA LISTAS ==========================
export const ListLoading = ({ count = 3 }) => {
  return (
    <div className="list-loading">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="list-loading-item">
          <div className="list-loading-avatar"></div>
          <div className="list-loading-content">
            <div className="list-loading-line list-loading-line-title"></div>
            <div className="list-loading-line list-loading-line-subtitle"></div>
            <div className="list-loading-line list-loading-line-text"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ======================= 🔄 LOADING PARA CARDS ==========================
export const CardLoading = ({ count = 4 }) => {
  return (
    <div className="card-loading-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-loading-item">
          <div className="card-loading-header">
            <div className="card-loading-avatar"></div>
            <div className="card-loading-info">
              <div className="card-loading-line"></div>
              <div className="card-loading-line card-loading-line-small"></div>
            </div>
          </div>
          <div className="card-loading-content">
            <div className="card-loading-line"></div>
            <div className="card-loading-line"></div>
            <div className="card-loading-line card-loading-line-small"></div>
          </div>
          <div className="card-loading-footer">
            <div className="card-loading-button"></div>
            <div className="card-loading-button"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

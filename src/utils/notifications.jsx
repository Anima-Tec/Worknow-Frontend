import React, { useState, useCallback } from 'react';
import './notifications.css';

// Hook para manejar notificaciones
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback(({ 
    type = 'success', 
    title, 
    message, 
    duration = 5000 
  }) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      title,
      message,
      duration,
      show: true
    };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, [removeNotification]);

  const showSuccess = useCallback((title, message, duration) => {
    return showNotification({ type: 'success', title, message, duration });
  }, [showNotification]);

  const showError = useCallback((title, message, duration) => {
    return showNotification({ type: 'error', title, message, duration });
  }, [showNotification]);

  const showWarning = useCallback((title, message, duration) => {
    return showNotification({ type: 'warning', title, message, duration });
  }, [showNotification]);

  const showInfo = useCallback((title, message, duration) => {
    return showNotification({ type: 'info', title, message, duration });
  }, [showNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll
  };
};

// Componente de notificación individual
const NotificationToast = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`notification-toast notification-${notification.type}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-text">
          <h4 className="notification-title">{notification.title}</h4>
          <p className="notification-message">{notification.message}</p>
        </div>
        <button 
          className="notification-close"
          onClick={() => onRemove(notification.id)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Contenedor de notificaciones
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Componente demo (opcional)
export const NotificationDemo = () => {
  const { 
    notifications, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    removeNotification
  } = useNotification();

  const handleSuccess = () => {
    showSuccess(
      "¡Éxito!",
      "La operación se completó correctamente.",
      4000
    );
  };

  const handleError = () => {
    showError(
      "Error",
      "Algo salió mal. Inténtalo de nuevo.",
      5000
    );
  };

  const handleWarning = () => {
    showWarning(
      "Advertencia",
      "Ten cuidado con esta acción.",
      4000
    );
  };

  const handleInfo = () => {
    showInfo(
      "Información",
      "Aquí tienes información útil.",
      4000
    );
  };

  return (
    <div className="notification-demo">
      <h2>Demo de Notificaciones</h2>
      <div className="notification-demo-buttons">
        <button className="demo-btn success" onClick={handleSuccess}>
          Éxito
        </button>
        <button className="demo-btn error" onClick={handleError}>
          Error
        </button>
        <button className="demo-btn warning" onClick={handleWarning}>
          Advertencia
        </button>
        <button className="demo-btn info" onClick={handleInfo}>
          Información
        </button>
      </div>
      
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

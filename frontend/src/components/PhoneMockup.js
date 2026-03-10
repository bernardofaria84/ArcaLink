import React from 'react';
import './PhoneMockup.css';

/**
 * ARCALINK: Phone Mockup — Simula tela de celular (iPhone 15 Pro style)
 * Envolve o conteúdo do app dentro de um frame de celular realista
 */
function PhoneMockup({ children }) {
  return (
    <div className="phone-scene">
      {/* Background da página */}
      <div className="page-background">
        <div className="bg-logo">ArcaLink</div>
        <div className="bg-tagline">Comunicação médica segura</div>
        <div className="bg-features">
          <div className="bg-feature">
            <span>Grupos privados por consulta</span>
          </div>
          <div className="bg-feature">
            <span>Conformidade LGPD</span>
          </div>
          <div className="bg-feature">
            <span>Proteção total de dados</span>
          </div>
        </div>
        <div className="bg-store-badges">
          <div className="store-badge">
            <span className="store-icon">&#xf8ff;</span>
            <div>
              <div className="store-label">Disponível na</div>
              <div className="store-name">App Store</div>
            </div>
          </div>
          <div className="store-badge">
            <span className="store-icon">▶</span>
            <div>
              <div className="store-label">Disponível no</div>
              <div className="store-name">Google Play</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Frame */}
      <div className="phone-wrapper">
        {/* Outer shell */}
        <div className="phone-shell">
          {/* Side buttons */}
          <div className="phone-btn volume-up" />
          <div className="phone-btn volume-down" />
          <div className="phone-btn power" />

          {/* Screen area */}
          <div className="phone-screen">
            {/* Status bar */}
            <div className="phone-status-bar">
              <span className="status-time">9:41</span>
              <div className="status-island" />
              <div className="status-icons">
                <span className="status-signal">▐▐▐</span>
                <span className="status-wifi">WiFi</span>
                <span className="status-battery">
                  <span className="battery-bar" />
                </span>
              </div>
            </div>

            {/* App Content — scroll container */}
            <div className="phone-content">
              {children}
            </div>

            {/* Home indicator */}
            <div className="phone-home-bar" />
          </div>
        </div>

        {/* Phone label */}
        <div className="phone-label">
          <span className="phone-label-name">ArcaLink</span>
          <span className="phone-label-sub">Preview do App Mobile</span>
        </div>
      </div>
    </div>
  );
}

export default PhoneMockup;

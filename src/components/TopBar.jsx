import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="site-topbar">
      <div className="container">
        <div className="topbar-content">
          <div className="topbar-info">
            <div className="topbar-info-item">
              <MapPin size={15} style={{ color: 'var(--accent-coral)' }} />
              <span>Nagercoil, Kanyakumari, Tamil Nadu</span>
            </div>
            <div className="topbar-info-item">
              <Phone size={15} style={{ color: 'var(--accent-coral)' }} />
              <span>+91 98765 43210</span>
            </div>
            <div className="topbar-info-item">
              <Mail size={15} style={{ color: 'var(--accent-coral)' }} />
              <span>info@nextalacademy.com</span>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="topbar-social">
              <a href="https://www.facebook.com/profile.php?id=61581030963089&mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="https://www.instagram.com/nextal_academy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==&igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Youtube"><Youtube size={16} /></a>
              <a href="https://www.linkedin.com/showcase/nextal-academy/" target="_blank" rel="noopener noreferrer" aria-label="Linkedin"><Linkedin size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

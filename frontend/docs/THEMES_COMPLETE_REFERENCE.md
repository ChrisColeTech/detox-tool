# Detox Tool - Complete Themes Reference

This document contains the complete CSS definitions for all 48 theme combinations in the Detox Tool application, specifically designed for JavaScript deobfuscation and reverse engineering workflows.

## Theme Structure

Each of the 12 color schemes has 4 variants:
1. Light mode: `.color-{scheme}`
2. Dark mode: `.color-{scheme}.dark`
3. High contrast light: `.color-{scheme}.high-contrast:not(.dark)`
4. High contrast dark: `.color-{scheme}.high-contrast.dark`

## 12 Custom Detox-Tool Color Schemes

The themes are designed around reverse engineering, code analysis, and cybersecurity aesthetics:

1. **Code Detective** - Professional analysis theme with sophisticated grays and blue accents
2. **Reverse Engineer** - Technical exploration with green terminals and dark backgrounds  
3. **Malware Hunter** - Security analysis with red warnings and protective blues
4. **Script Sleuth** - Investigation theme with amber highlights and forensic styling
5. **Debug Master** - Debugging focused with orange breakpoints and console colors
6. **Hex Analyst** - Low-level analysis with purple hex codes and binary styling
7. **Binary Explorer** - Matrix effects with neon green on black
8. **Cyber Forensics** - Neon cyber theme with electric blues and digital styling
9. **Code Breaker** - Cryptanalysis with golden keys and cipher aesthetics
10. **Threat Hunter** - Security monitoring with dark reds and alert styling
11. **Digital Archaeologist** - Code excavation with earth tones and discovery styling
12. **Obfuscation Buster** - Anti-obfuscation with clear contrasts and transparency effects

## Complete CSS Definitions

```css
/* Color Scheme Theme Definitions
 * Detox Tool - Dual-Dimension Theming System
 * 
 * Each color scheme has 4 variants:
 * 1. Light mode: .color-{scheme}
 * 2. Dark mode: .color-{scheme}.dark
 * 3. High contrast light: .color-{scheme}.high-contrast:not(.dark)
 * 4. High contrast dark: .color-{scheme}.high-contrast.dark
 *
 * CSS Specificity Order (CRITICAL):
 * 1. Base color scheme (lowest)
 * 2. Dark mode override (medium)
 * 3. High contrast override (highest)
 */

/* =============================================================================
   CODE DETECTIVE COLOR SCHEME (Default)
   Professional analysis theme with sophisticated grays and blue accents
   ============================================================================= */

.color-code-detective {
  /* Light mode - Professional and clean */
  --background: #ffffff;
  --surface: #f8f9fa;
  --surface-hover: rgba(59, 130, 246, 0.08);
  --text: #1f2937;
  --text-muted: #6b7280;
  --text-background: #ffffff;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --border: #e5e7eb;
  --border-thin: rgba(229, 231, 235, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #d1d5db;
  --shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  
  /* Status colors - detective theme */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Enhanced effects */
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-code-detective.dark {
  /* Dark mode - Professional investigation */
  --background: #0f172a;
  --surface: #1e293b;
  --surface-hover: rgba(59, 130, 246, 0.15);
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --text-background: #0f172a;
  --accent: #60a5fa;
  --accent-hover: #3b82f6;
  --border: #334155;
  --border-thin: rgba(51, 65, 85, 0.4);
  --input-bg: #1e293b;
  --scrollbar: #475569;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  /* Status colors - brighter for dark */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #60a5fa;
  --status-info-bg: rgba(96, 165, 250, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-code-detective.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(0, 0, 139, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #0000ff !important;
  --accent-hover: #0066ff !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  /* High contrast status colors */
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-code-detective.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 255, 255, 0.15) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffff00 !important;
  --accent-hover: #ffff66 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  /* High contrast dark status */
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   REVERSE ENGINEER COLOR SCHEME
   Technical exploration with green terminals and dark backgrounds
   ============================================================================= */

.color-reverse-engineer {
  /* Light mode - Technical documentation */
  --background: #f9fafb;
  --surface: #f3f4f6;
  --surface-hover: rgba(34, 197, 94, 0.08);
  --text: #111827;
  --text-muted: #6b7280;
  --text-background: #f9fafb;
  --accent: #22c55e;
  --accent-hover: #16a34a;
  --border: #d1d5db;
  --border-thin: rgba(209, 213, 219, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #9ca3af;
  --shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
  
  /* Status colors - terminal theme */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.1);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.1);
  --status-info: #22c55e;
  --status-info-bg: rgba(34, 197, 94, 0.1);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-reverse-engineer.dark {
  /* Dark mode - Terminal hacker aesthetic */
  --background: #0c0c0c;
  --surface: #1a1a1a;
  --surface-hover: rgba(34, 197, 94, 0.15);
  --text: #00ff41;
  --text-muted: #00cc33;
  --text-background: #0c0c0c;
  --accent: #00ff41;
  --accent-hover: #33ff66;
  --border: #333333;
  --border-thin: rgba(51, 51, 51, 0.4);
  --input-bg: #1a1a1a;
  --scrollbar: #00cc33;
  --shadow: 0 2px 8px rgba(0, 255, 65, 0.2);
  
  /* Terminal status colors */
  --status-error: #ff4444;
  --status-error-bg: rgba(255, 68, 68, 0.15);
  --status-warning: #ffaa00;
  --status-warning-bg: rgba(255, 170, 0, 0.15);
  --status-info: #00ff41;
  --status-info-bg: rgba(0, 255, 65, 0.15);
  --status-success: #00ff00;
  --status-success-bg: rgba(0, 255, 0, 0.15);
}

.color-reverse-engineer.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(0, 128, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #008000 !important;
  --accent-hover: #00aa00 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #008000 !important;
  --status-info-bg: rgba(0, 128, 0, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-reverse-engineer.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(0, 255, 0, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #00ff00 !important;
  --accent-hover: #66ff66 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(0, 255, 0, 0.4) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #00ff00 !important;
  --status-info-bg: rgba(0, 255, 0, 0.25) !important;
  --status-success: #66ff66 !important;
  --status-success-bg: rgba(102, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   MALWARE HUNTER COLOR SCHEME
   Security analysis with red warnings and protective blues
   ============================================================================= */

.color-malware-hunter {
  /* Light mode - Security focused */
  --background: #fefefe;
  --surface: #f8fafc;
  --surface-hover: rgba(239, 68, 68, 0.08);
  --text: #1f2937;
  --text-muted: #6b7280;
  --text-background: #fefefe;
  --accent: #ef4444;
  --accent-hover: #dc2626;
  --border: #e5e7eb;
  --border-thin: rgba(229, 231, 235, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #d1d5db;
  --shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
  
  /* Security status colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.1);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-malware-hunter.dark {
  /* Dark mode - Threat detection */
  --background: #1a0a0a;
  --surface: #2a1414;
  --surface-hover: rgba(239, 68, 68, 0.15);
  --text: #fca5a5;
  --text-muted: #f87171;
  --text-background: #1a0a0a;
  --accent: #f87171;
  --accent-hover: #ef4444;
  --border: #451a1a;
  --border-thin: rgba(69, 26, 26, 0.4);
  --input-bg: #2a1414;
  --scrollbar: #7f1d1d;
  --shadow: 0 2px 8px rgba(248, 113, 113, 0.2);
  
  /* Threat detection colors */
  --status-error: #ff6b6b;
  --status-error-bg: rgba(255, 107, 107, 0.15);
  --status-warning: #fbbf24;
  --status-warning-bg: rgba(251, 191, 36, 0.15);
  --status-info: #60a5fa;
  --status-info-bg: rgba(96, 165, 250, 0.15);
  --status-success: #34d399;
  --status-success-bg: rgba(52, 211, 153, 0.15);
}

.color-malware-hunter.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(139, 0, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #8b0000 !important;
  --accent-hover: #aa0000 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-malware-hunter.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 0, 0, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ff0000 !important;
  --accent-hover: #ff6666 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 0, 0, 0.4) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   SCRIPT SLEUTH COLOR SCHEME
   Investigation theme with amber highlights and forensic styling
   ============================================================================= */

.color-script-sleuth {
  /* Light mode - Investigation workspace */
  --background: #fffbeb;
  --surface: #fef3c7;
  --surface-hover: rgba(245, 158, 11, 0.08);
  --text: #92400e;
  --text-muted: #a16207;
  --text-background: #fffbeb;
  --accent: #d97706;
  --accent-hover: #b45309;
  --border: #fcd34d;
  --border-thin: rgba(252, 211, 77, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #fbbf24;
  --shadow: 0 2px 8px rgba(217, 119, 6, 0.1);
  
  /* Investigation colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #0891b2;
  --status-info-bg: rgba(8, 145, 178, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-script-sleuth.dark {
  /* Dark mode - Evidence room */
  --background: #1c1917;
  --surface: #292524;
  --surface-hover: rgba(245, 158, 11, 0.15);
  --text: #fbbf24;
  --text-muted: #f59e0b;
  --text-background: #1c1917;
  --accent: #fbbf24;
  --accent-hover: #f59e0b;
  --border: #44403c;
  --border-thin: rgba(68, 64, 60, 0.4);
  --input-bg: #292524;
  --scrollbar: #78716c;
  --shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
  
  /* Evidence room colors */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #fbbf24;
  --status-warning-bg: rgba(251, 191, 36, 0.15);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-script-sleuth.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(255, 140, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #ff8c00 !important;
  --accent-hover: #ff7700 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff8c00 !important;
  --status-warning-bg: rgba(255, 140, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-script-sleuth.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 215, 0, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffd700 !important;
  --accent-hover: #ffed4e !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 215, 0, 0.4) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffd700 !important;
  --status-warning-bg: rgba(255, 215, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   DEBUG MASTER COLOR SCHEME
   Debugging focused with orange breakpoints and console colors
   ============================================================================= */

.color-debug-master {
  /* Light mode - Debug console */
  --background: #fff7ed;
  --surface: #fed7aa;
  --surface-hover: rgba(249, 115, 22, 0.08);
  --text: #9a3412;
  --text-muted: #c2410c;
  --text-background: #fff7ed;
  --accent: #f97316;
  --accent-hover: #ea580c;
  --border: #fdba74;
  --border-thin: rgba(253, 186, 116, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #fb923c;
  --shadow: 0 2px 8px rgba(249, 115, 22, 0.1);
  
  /* Debug status colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #f97316;
  --status-warning-bg: rgba(249, 115, 22, 0.1);
  --status-info: #0891b2;
  --status-info-bg: rgba(8, 145, 178, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-debug-master.dark {
  /* Dark mode - Debug session */
  --background: #1c1917;
  --surface: #431407;
  --surface-hover: rgba(249, 115, 22, 0.15);
  --text: #fb923c;
  --text-muted: #f97316;
  --text-background: #1c1917;
  --accent: #fb923c;
  --accent-hover: #f97316;
  --border: #7c2d12;
  --border-thin: rgba(124, 45, 18, 0.4);
  --input-bg: #431407;
  --scrollbar: #9a3412;
  --shadow: 0 2px 8px rgba(251, 146, 60, 0.2);
  
  /* Debug session colors */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #fb923c;
  --status-warning-bg: rgba(251, 146, 60, 0.15);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-debug-master.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(255, 69, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #ff4500 !important;
  --accent-hover: #ff6600 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff4500 !important;
  --status-warning-bg: rgba(255, 69, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-debug-master.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 165, 0, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffa500 !important;
  --accent-hover: #ffb84d !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 165, 0, 0.4) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffa500 !important;
  --status-warning-bg: rgba(255, 165, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   HEX ANALYST COLOR SCHEME
   Low-level analysis with purple hex codes and binary styling
   ============================================================================= */

.color-hex-analyst {
  /* Light mode - Hex editor */
  --background: #faf5ff;
  --surface: #e9d5ff;
  --surface-hover: rgba(147, 51, 234, 0.08);
  --text: #6b21a8;
  --text-muted: #7c3aed;
  --text-background: #faf5ff;
  --accent: #9333ea;
  --accent-hover: #7c3aed;
  --border: #c4b5fd;
  --border-thin: rgba(196, 181, 253, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #a855f7;
  --shadow: 0 2px 8px rgba(147, 51, 234, 0.1);
  
  /* Hex analysis colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #9333ea;
  --status-info-bg: rgba(147, 51, 234, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-hex-analyst.dark {
  /* Dark mode - Binary analysis */
  --background: #1e1b4b;
  --surface: #312e81;
  --surface-hover: rgba(167, 139, 250, 0.15);
  --text: #c4b5fd;
  --text-muted: #a78bfa;
  --text-background: #1e1b4b;
  --accent: #a78bfa;
  --accent-hover: #8b5cf6;
  --border: #4c1d95;
  --border-thin: rgba(76, 29, 149, 0.4);
  --input-bg: #312e81;
  --scrollbar: #6d28d9;
  --shadow: 0 2px 8px rgba(167, 139, 250, 0.2);
  
  /* Binary analysis colors */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #a78bfa;
  --status-info-bg: rgba(167, 139, 250, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-hex-analyst.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(75, 0, 130, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #4b0082 !important;
  --accent-hover: #6a0dad !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #4b0082 !important;
  --status-info-bg: rgba(75, 0, 130, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-hex-analyst.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(138, 43, 226, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #8a2be2 !important;
  --accent-hover: #9932cc !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(138, 43, 226, 0.4) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #8a2be2 !important;
  --status-info-bg: rgba(138, 43, 226, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   BINARY EXPLORER COLOR SCHEME
   Matrix effects with neon green on black
   ============================================================================= */

.color-binary-explorer {
  /* Light mode - Matrix data streams */
  --background: #f0fdf4;
  --surface: #dcfce7;
  --surface-hover: rgba(34, 197, 94, 0.08);
  --text: #14532d;
  --text-muted: #166534;
  --text-background: #f0fdf4;
  --accent: #22c55e;
  --accent-hover: #16a34a;
  --border: #86efac;
  --border-thin: rgba(134, 239, 172, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #4ade80;
  --shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
  
  /* Matrix status colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #22c55e;
  --status-info-bg: rgba(34, 197, 94, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Matrix effects for light mode (subtle) */
  --accent-glow: 0 0 10px rgba(34, 197, 94, 0.3);
  --text-glow: none;
  --neon-border: 1px solid rgba(34, 197, 94, 0.3);
}

.color-binary-explorer.dark {
  /* Dark mode - Full Matrix effect */
  --background: #000000;
  --surface: #001100;
  --surface-hover: rgba(0, 255, 65, 0.15);
  --text: #00ff41;
  --text-muted: #00cc33;
  --text-background: #000000;
  --accent: #00ff41;
  --accent-hover: #33ff66;
  --border: #003300;
  --border-thin: rgba(0, 51, 0, 0.4);
  --input-bg: #001100;
  --scrollbar: #00cc33;
  --shadow: 0 2px 8px rgba(0, 255, 65, 0.3);
  
  /* Matrix digital rain colors */
  --status-error: #ff3333;
  --status-error-bg: rgba(255, 51, 51, 0.15);
  --status-warning: #ffaa00;
  --status-warning-bg: rgba(255, 170, 0, 0.15);
  --status-info: #00ff41;
  --status-info-bg: rgba(0, 255, 65, 0.15);
  --status-success: #00ff00;
  --status-success-bg: rgba(0, 255, 0, 0.15);
  
  /* Enhanced Matrix effects */
  --accent-glow: 0 0 20px rgba(0, 255, 65, 0.6), 0 0 40px rgba(0, 255, 65, 0.3);
  --text-glow: 0 0 5px rgba(0, 255, 65, 0.8);
  --neon-border: 1px solid rgba(0, 255, 65, 0.8);
}

.color-binary-explorer.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(0, 128, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #008000 !important;
  --accent-hover: #00aa00 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #008000 !important;
  --status-info-bg: rgba(0, 128, 0, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-binary-explorer.high-contrast.dark {
  /* Dark high contrast - Maximum Matrix */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(0, 255, 0, 0.3) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #00ff00 !important;
  --accent-hover: #66ff66 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(0, 255, 0, 0.6) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #00ff00 !important;
  --status-info-bg: rgba(0, 255, 0, 0.25) !important;
  --status-success: #66ff66 !important;
  --status-success-bg: rgba(102, 255, 102, 0.25) !important;
  
  /* Ultra Matrix effects */
  --accent-glow: 0 0 30px rgba(0, 255, 0, 1) !important;
  --text-glow: 0 0 10px rgba(0, 255, 0, 1) !important;
  --neon-border: 2px solid rgba(0, 255, 0, 1) !important;
}

/* =============================================================================
   CYBER FORENSICS COLOR SCHEME
   Neon cyber theme with electric blues and digital styling
   ============================================================================= */

.color-cyber-forensics {
  /* Light mode - Digital forensics lab */
  --background: #f0f9ff;
  --surface: #e0f2fe;
  --surface-hover: rgba(6, 182, 212, 0.08);
  --text: #0c4a6e;
  --text-muted: #0369a1;
  --text-background: #f0f9ff;
  --accent: #06b6d4;
  --accent-hover: #0891b2;
  --border: #7dd3fc;
  --border-thin: rgba(125, 211, 252, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #38bdf8;
  --shadow: 0 2px 8px rgba(6, 182, 212, 0.1);
  
  /* Forensics status colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  /* Cyber effects for light mode */
  --accent-glow: 0 0 8px rgba(6, 182, 212, 0.3);
  --text-glow: none;
  --neon-border: 1px solid rgba(6, 182, 212, 0.3);
}

.color-cyber-forensics.dark {
  /* Dark mode - Full cyber experience */
  --background: #020617;
  --surface: #0f172a;
  --surface-hover: rgba(56, 189, 248, 0.15);
  --text: #38bdf8;
  --text-muted: #0ea5e9;
  --text-background: #020617;
  --accent: #0ea5e9;
  --accent-hover: #0284c7;
  --border: #1e40af;
  --border-thin: rgba(30, 64, 175, 0.4);
  --input-bg: #0f172a;
  --scrollbar: #2563eb;
  --shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
  
  /* Cyber grid colors */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #38bdf8;
  --status-info-bg: rgba(56, 189, 248, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
  
  /* Enhanced cyber effects */
  --accent-glow: 0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(14, 165, 233, 0.3);
  --text-glow: 0 0 5px rgba(56, 189, 248, 0.8);
  --neon-border: 1px solid rgba(56, 189, 248, 0.8);
}

.color-cyber-forensics.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(0, 0, 139, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #00008b !important;
  --accent-hover: #0066cc !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #00008b !important;
  --status-info-bg: rgba(0, 0, 139, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-cyber-forensics.high-contrast.dark {
  /* Dark high contrast - Maximum cyber */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(0, 191, 255, 0.3) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #00bfff !important;
  --accent-hover: #66d9ff !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(0, 191, 255, 0.6) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #00bfff !important;
  --status-info-bg: rgba(0, 191, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  /* Ultra cyber effects */
  --accent-glow: 0 0 30px rgba(0, 191, 255, 1) !important;
  --text-glow: 0 0 10px rgba(0, 191, 255, 1) !important;
  --neon-border: 2px solid rgba(0, 191, 255, 1) !important;
}

/* =============================================================================
   CODE BREAKER COLOR SCHEME
   Cryptanalysis with golden keys and cipher aesthetics
   ============================================================================= */

.color-code-breaker {
  /* Light mode - Cryptography workspace */
  --background: #fffef7;
  --surface: #fef3c7;
  --surface-hover: rgba(245, 158, 11, 0.08);
  --text: #92400e;
  --text-muted: #a16207;
  --text-background: #fffef7;
  --accent: #f59e0b;
  --accent-hover: #d97706;
  --border: #fde68a;
  --border-thin: rgba(253, 230, 138, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #fbbf24;
  --shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
  
  /* Cryptography status colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.1);
  --status-info: #0891b2;
  --status-info-bg: rgba(8, 145, 178, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-code-breaker.dark {
  /* Dark mode - Cipher chamber */
  --background: #1c1917;
  --surface: #78716c;
  --surface-hover: rgba(245, 158, 11, 0.15);
  --text: #fde68a;
  --text-muted: #fbbf24;
  --text-background: #1c1917;
  --accent: #fbbf24;
  --accent-hover: #f59e0b;
  --border: #57534e;
  --border-thin: rgba(87, 83, 78, 0.4);
  --input-bg: #78716c;
  --scrollbar: #a8a29e;
  --shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
  
  /* Cipher chamber colors */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #fbbf24;
  --status-warning-bg: rgba(251, 191, 36, 0.15);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-code-breaker.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(255, 215, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #ffd700 !important;
  --accent-hover: #ffed4e !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ffd700 !important;
  --status-warning-bg: rgba(255, 215, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-code-breaker.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 215, 0, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffd700 !important;
  --accent-hover: #ffed4e !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 215, 0, 0.4) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffd700 !important;
  --status-warning-bg: rgba(255, 215, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   THREAT HUNTER COLOR SCHEME
   Security monitoring with dark reds and alert styling
   ============================================================================= */

.color-threat-hunter {
  /* Light mode - Security operations center */
  --background: #fef2f2;
  --surface: #fecaca;
  --surface-hover: rgba(220, 38, 38, 0.08);
  --text: #7f1d1d;
  --text-muted: #991b1b;
  --text-background: #fef2f2;
  --accent: #dc2626;
  --accent-hover: #b91c1c;
  --border: #fca5a5;
  --border-thin: rgba(252, 165, 165, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #f87171;
  --shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
  
  /* Security operations colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #0891b2;
  --status-info-bg: rgba(8, 145, 178, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-threat-hunter.dark {
  /* Dark mode - Alert status */
  --background: #1f1917;
  --surface: #7f1d1d;
  --surface-hover: rgba(239, 68, 68, 0.15);
  --text: #fca5a5;
  --text-muted: #f87171;
  --text-background: #1f1917;
  --accent: #f87171;
  --accent-hover: #ef4444;
  --border: #450a0a;
  --border-thin: rgba(69, 10, 10, 0.4);
  --input-bg: #7f1d1d;
  --scrollbar: #991b1b;
  --shadow: 0 2px 8px rgba(248, 113, 113, 0.2);
  
  /* Alert status colors */
  --status-error: #ff6b6b;
  --status-error-bg: rgba(255, 107, 107, 0.15);
  --status-warning: #fbbf24;
  --status-warning-bg: rgba(251, 191, 36, 0.15);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-threat-hunter.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(139, 0, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #8b0000 !important;
  --accent-hover: #aa0000 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #8b0000 !important;
  --status-error-bg: rgba(139, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-threat-hunter.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 0, 0, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ff0000 !important;
  --accent-hover: #ff6666 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 0, 0, 0.4) !important;
  
  --status-error: #ff0000 !important;
  --status-error-bg: rgba(255, 0, 0, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   DIGITAL ARCHAEOLOGIST COLOR SCHEME
   Code excavation with earth tones and discovery styling
   ============================================================================= */

.color-digital-archaeologist {
  /* Light mode - Archaeological site */
  --background: #faf8f5;
  --surface: #f5f1eb;
  --surface-hover: rgba(120, 113, 108, 0.08);
  --text: #44403c;
  --text-muted: #57534e;
  --text-background: #faf8f5;
  --accent: #78716c;
  --accent-hover: #57534e;
  --border: #d6d3d1;
  --border-thin: rgba(214, 211, 209, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #a8a29e;
  --shadow: 0 2px 8px rgba(120, 113, 108, 0.1);
  
  /* Archaeological discovery colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #0891b2;
  --status-info-bg: rgba(8, 145, 178, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-digital-archaeologist.dark {
  /* Dark mode - Ancient chambers */
  --background: #1c1917;
  --surface: #292524;
  --surface-hover: rgba(168, 162, 158, 0.15);
  --text: #e7e5e4;
  --text-muted: #d6d3d1;
  --text-background: #1c1917;
  --accent: #a8a29e;
  --accent-hover: #78716c;
  --border: #44403c;
  --border-thin: rgba(68, 64, 60, 0.4);
  --input-bg: #292524;
  --scrollbar: #57534e;
  --shadow: 0 2px 8px rgba(168, 162, 158, 0.2);
  
  /* Ancient chamber colors */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-digital-archaeologist.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(101, 67, 33, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #654321 !important;
  --accent-hover: #8b4513 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-digital-archaeologist.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(210, 180, 140, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #d2b48c !important;
  --accent-hover: #deb887 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(210, 180, 140, 0.4) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   OBFUSCATION BUSTER COLOR SCHEME
   Anti-obfuscation with clear contrasts and transparency effects
   ============================================================================= */

.color-obfuscation-buster {
  /* Light mode - Clear visibility */
  --background: #ffffff;
  --surface: #f8fafc;
  --surface-hover: rgba(51, 65, 85, 0.08);
  --text: #0f172a;
  --text-muted: #475569;
  --text-background: #ffffff;
  --accent: #334155;
  --accent-hover: #1e293b;
  --border: #cbd5e1;
  --border-thin: rgba(203, 213, 225, 0.3);
  --input-bg: #ffffff;
  --scrollbar: #94a3b8;
  --shadow: 0 2px 8px rgba(51, 65, 85, 0.1);
  
  /* Clear analysis colors */
  --status-error: #dc2626;
  --status-error-bg: rgba(220, 38, 38, 0.1);
  --status-warning: #d97706;
  --status-warning-bg: rgba(217, 119, 6, 0.1);
  --status-info: #0891b2;
  --status-info-bg: rgba(8, 145, 178, 0.1);
  --status-success: #059669;
  --status-success-bg: rgba(5, 150, 105, 0.1);
  
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}

.color-obfuscation-buster.dark {
  /* Dark mode - X-ray vision */
  --background: #0f172a;
  --surface: #1e293b;
  --surface-hover: rgba(148, 163, 184, 0.15);
  --text: #f1f5f9;
  --text-muted: #cbd5e1;
  --text-background: #0f172a;
  --accent: #94a3b8;
  --accent-hover: #64748b;
  --border: #334155;
  --border-thin: rgba(51, 65, 85, 0.4);
  --input-bg: #1e293b;
  --scrollbar: #475569;
  --shadow: 0 2px 8px rgba(148, 163, 184, 0.2);
  
  /* X-ray analysis colors */
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.15);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.15);
  --status-info: #06b6d4;
  --status-info-bg: rgba(6, 182, 212, 0.15);
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.15);
}

.color-obfuscation-buster.high-contrast:not(.dark) {
  /* Light high contrast */
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --surface-hover: rgba(0, 0, 0, 0.2) !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --text-background: #ffffff !important;
  --accent: #000000 !important;
  --accent-hover: #333333 !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
  --input-bg: #ffffff !important;
  --scrollbar: #666666 !important;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  
  --status-error: #cc0000 !important;
  --status-error-bg: rgba(204, 0, 0, 0.2) !important;
  --status-warning: #ff6600 !important;
  --status-warning-bg: rgba(255, 102, 0, 0.2) !important;
  --status-info: #0066cc !important;
  --status-info-bg: rgba(0, 102, 204, 0.2) !important;
  --status-success: #006600 !important;
  --status-success-bg: rgba(0, 102, 0, 0.2) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

.color-obfuscation-buster.high-contrast.dark {
  /* Dark high contrast */
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --surface-hover: rgba(255, 255, 255, 0.2) !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --text-background: #000000 !important;
  --accent: #ffffff !important;
  --accent-hover: #cccccc !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
  --input-bg: #1a1a1a !important;
  --scrollbar: #aaaaaa !important;
  --shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  
  --status-error: #ff3333 !important;
  --status-error-bg: rgba(255, 51, 51, 0.25) !important;
  --status-warning: #ffaa00 !important;
  --status-warning-bg: rgba(255, 170, 0, 0.25) !important;
  --status-info: #3399ff !important;
  --status-info-bg: rgba(51, 153, 255, 0.25) !important;
  --status-success: #00ff66 !important;
  --status-success-bg: rgba(0, 255, 102, 0.25) !important;
  
  --accent-glow: none !important;
  --text-glow: none !important;
  --neon-border: none !important;
}

/* =============================================================================
   ENHANCED EFFECTS UTILITIES
   Special effects for Binary Explorer and Cyber Forensics themes
   ============================================================================= */

/* Matrix effect animation keyframes */
@keyframes matrix-glow {
  0%, 100% { text-shadow: var(--text-glow); }
  50% { text-shadow: var(--text-glow), var(--accent-glow); }
}

@keyframes cyber-pulse {
  0%, 100% { border-color: var(--accent); }
  50% { border-color: var(--accent-hover); box-shadow: var(--accent-glow); }
}

/* Apply enhanced effects to specific themes */
.color-binary-explorer.dark *:focus,
.color-cyber-forensics.dark *:focus {
  animation: cyber-pulse 2s infinite;
}

.color-binary-explorer.dark .text-accent,
.color-binary-explorer.high-contrast.dark .text-accent {
  animation: matrix-glow 3s infinite;
  text-shadow: var(--text-glow);
}

.color-cyber-forensics.dark .text-accent,
.color-cyber-forensics.high-contrast.dark .text-accent {
  animation: cyber-pulse 2s infinite;
  text-shadow: var(--text-glow);
}

/* Neon border utilities */
.neon-border {
  border: var(--neon-border);
}

.accent-glow {
  box-shadow: var(--accent-glow);
}

.text-glow {
  text-shadow: var(--text-glow);
}
```

## Usage Instructions

### Applying Themes

To apply a theme, add the appropriate classes to your root element:

```html
<!-- Code Detective Dark Mode -->
<div class="color-code-detective dark">

<!-- Binary Explorer Dark with High Contrast -->
<div class="color-binary-explorer dark high-contrast">

<!-- Cyber Forensics Light Mode -->
<div class="color-cyber-forensics">
```

### CSS Specificity Order

The themes follow a strict CSS specificity order:
1. **Base color scheme** (lowest): `.color-{scheme}`
2. **Dark mode override** (medium): `.color-{scheme}.dark`
3. **High contrast override** (highest): `.color-{scheme}.high-contrast`

### Enhanced Effects

Two themes include special visual effects:

- **Binary Explorer**: Matrix-style glows and digital rain effects
- **Cyber Forensics**: Neon glows and cyber grid styling

These effects are automatically applied in dark and high-contrast dark modes.

### Theme Variables

All themes provide these CSS custom properties:

- **Layout**: `--background`, `--surface`, `--surface-hover`
- **Typography**: `--text`, `--text-muted`, `--text-background`
- **Interactive**: `--accent`, `--accent-hover`
- **Structure**: `--border`, `--border-thin`
- **Controls**: `--input-bg`, `--scrollbar`
- **Depth**: `--shadow`
- **Status**: `--status-error`, `--status-warning`, `--status-info`, `--status-success`
- **Effects**: `--accent-glow`, `--text-glow`, `--neon-border`

This comprehensive theme system provides 48 unique visual experiences tailored specifically for JavaScript deobfuscation and reverse engineering workflows.
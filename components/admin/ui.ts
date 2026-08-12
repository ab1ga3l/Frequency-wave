/**
 * Shared class strings for Mission Control — flat, sharp, HUD-style.
 * Motif: every card carries a 2px cyan accent line on top. No glass, no pills.
 */

export const inputCls =
  'w-full rounded-[2px] bg-[#060d2e]/60 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-cyan/60';

export const selectCls = inputCls + ' appearance-none';

export const labelCls =
  'block font-mono uppercase tracking-[0.25em] text-[0.62rem] text-white/40 mb-1.5';

export const smallBtnCls =
  'rounded-[2px] border border-white/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70 transition-colors hover:border-cyan/50 hover:text-cyan';

export const dangerBtnCls =
  'rounded-[2px] border border-[#e93cac]/60 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#e93cac] transition-colors hover:bg-[#e93cac]/10';

/** HUD card: flat panel with the cyan top accent line. */
export const cardCls =
  'rounded-none border border-white/10 border-t-2 border-t-cyan/60 bg-[#060d2e]/60';

/** Uppercase micro-label used above data blocks. */
export const microLabelCls =
  'font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/40';

/** Flat rectangular status tag base — pair with a color variant below. */
export const tagCls =
  'inline-block rounded-none border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider';

export const tagCyan = 'border-cyan/50 text-cyan';
export const tagGold = 'border-gold/50 text-gold';
export const tagDanger = 'border-[#e93cac]/50 text-[#e93cac]';
export const tagMuted = 'border-white/20 text-white/40';

/** Inline error / success banners (flat). */
export const errorBannerCls =
  'rounded-none border border-[#e93cac]/50 bg-[#e93cac]/10 px-4 py-3 text-sm text-[#e93cac]';

export const okBannerCls =
  'rounded-none border border-cyan/40 bg-cyan/10 px-4 py-3 font-mono text-xs uppercase tracking-widest text-cyan';

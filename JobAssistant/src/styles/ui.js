export const app = 'flex flex-col min-h-screen';
export const appHeader = 'flex items-center gap-3 px-6 pt-5 pb-4 border-b border-surface-strong/70';
export const logo = 'w-[34px] h-[34px] rounded-full bg-accent shrink-0';
export const appTitle = 'text-xl font-bold m-0 tracking-[-0.3px] lowercase flex-1';

export const panel = 'flex-1 px-6 pt-5 pb-7 flex flex-col gap-5';
export const panelBottomActions = 'pb-[104px]';

export const card = 'bg-surface rounded-card p-4 border border-surface-strong/70';

export const sectionHeaderTitle = 'font-bold text-lg tracking-tight';

export const label = 'block text-[13px] font-semibold text-muted tracking-wide mb-2';

const fieldBase =
  'w-full bg-field border border-transparent text-ink font-sans outline-none placeholder:text-muted transition-colors focus:border-accent/50 focus:ring-2 focus:ring-accent/20';

export const input = `${fieldBase} rounded-pill px-4 py-3 text-[15px]`;

export const textarea = `${fieldBase} rounded-card px-4 py-3 text-[15px] resize-y min-h-[160px] leading-relaxed`;

export const select = `${fieldBase} rounded-pill px-4 py-3 text-[15px] cursor-pointer`;

export const btn =
  'inline-flex items-center justify-center gap-2 rounded-pill border-none px-5 py-3 text-[15px] font-semibold cursor-pointer transition-[opacity,transform] duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 bg-btn text-btn-ink enabled:hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

export const btnPrimary = 'bg-primary! text-primary-ink! font-bold';

export const btnIcon = 'p-0 w-11 h-11 rounded-full text-[18px]';
export const btnIconSm = 'p-0 w-[26px] h-[26px] rounded-full text-[13px]';

export const row = 'flex items-center gap-2.5';
export const rowBetween = 'flex items-center justify-between';

export const muted = 'text-muted';
export const small = 'text-sm';

export const subtabs = 'flex gap-2 mb-1';
export const subtab =
  'flex-1 text-center px-3 py-2.5 rounded-pill border-none bg-surface text-muted text-[14px] font-semibold cursor-pointer transition-colors disabled:cursor-default disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';
export const subtabActive = 'text-primary-ink! bg-primary!';

export const dropzone =
  'border-2 border-dashed border-surface-strong rounded-card px-4 py-6 text-center cursor-pointer transition-colors text-muted text-[15px] bg-field hover:bg-surface-strong hover:text-ink hover:border-accent/50';
export const dropzoneActive = 'bg-surface-strong! text-ink! border-accent!';
export const filename = 'text-ink font-semibold';

export const badge =
  'inline-block text-xs font-semibold px-[11px] py-1 rounded-pill bg-surface-strong text-muted';

export const spinner =
  'w-[17px] h-[17px] rounded-full border-[2.5px] border-white/35 border-t-current animate-spin';

export const errorBox =
  'bg-danger/10 text-danger rounded-card px-4 py-3.5 text-[14px] leading-relaxed font-medium border border-danger/20';

export const infoIcon = 'text-muted cursor-help';

export const bottomActions =
  'flex gap-2.5 fixed left-0 right-0 bottom-0 px-6 pt-4 pb-5 bg-shell border-t border-surface-strong/70 z-20';

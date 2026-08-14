import RepeatingSection from './RepeatingSection.jsx';
import * as ui from '../../styles/ui.js';

export default function ProfileField({ field, value, onChange }) {
  const { type, label, options } = field;

  if (type === 'repeating') {
    return (
      <div>
        <label className={ui.label}>{label}</label>
        <RepeatingSection
          items={value || []}
          onChange={onChange}
          fields={field.fields}
          emptyItem={field.emptyItem}
          compact
        />
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <label className={`${ui.row} normal-case font-normal text-ink`}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-[18px] h-[18px] accent-accent"
        />
        {label}
      </label>
    );
  }

  if (type === 'select') {
    return (
      <div>
        <label className={ui.label}>{label}</label>
        <select
          className={ui.select}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        <label className={ui.label}>{label}</label>
        <textarea
          className={ui.textarea}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (type === 'number') {
    return (
      <div>
        <label className={ui.label}>{label}</label>
        <input
          type="text"
          inputMode="numeric"
          className={ui.input}
          value={value ?? ''}
          onChange={(e) => {
            const n = e.target.value.replace(/[^\d.-]/g, '');
            onChange(n === '' ? null : Number(n));
          }}
        />
      </div>
    );
  }

  if (type === 'tags') {
    return (
      <div>
        <label className={ui.label}>{label}</label>
        <input
          type="text"
          className={ui.input}
          value={(value || []).join(', ')}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
            )
          }
          placeholder="comma, separated, values"
        />
      </div>
    );
  }

  return (
    <div>
      <label className={ui.label}>{label}</label>
      <input
        type={field.inputType || 'text'}
        name={field.autoComplete ? field.key : undefined}
        autoComplete={field.autoComplete || 'off'}
        className={ui.input}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

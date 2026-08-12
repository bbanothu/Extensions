import RepeatingSection from './RepeatingSection.jsx';

export default function ProfileField({ field, value, onChange }) {
  const { type, label, options } = field;

  if (type === 'repeating') {
    return (
      <div>
        <label>{label}</label>
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
      <label
        className="row"
        style={{ textTransform: 'none', fontWeight: 400, color: 'var(--text)' }}
      >
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
        {label}
      </label>
    );
  }

  if (type === 'select') {
    return (
      <div>
        <label>{label}</label>
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
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
        <label>{label}</label>
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  if (type === 'number') {
    return (
      <div>
        <label>{label}</label>
        <input
          type="text"
          inputMode="numeric"
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
        <label>{label}</label>
        <input
          type="text"
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
      <label>{label}</label>
      <input
        type={field.inputType || 'text'}
        name={field.autoComplete ? field.key : undefined}
        autoComplete={field.autoComplete || 'off'}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

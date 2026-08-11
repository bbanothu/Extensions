import ProfileField from './ProfileField.jsx';

export default function RepeatingSection({
  items,
  onChange,
  fields,
  emptyItem,
  itemLabel,
  compact,
}) {
  function updateItem(index, key, value) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function addItem() {
    onChange([...items, { ...emptyItem }]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : 14 }}>
      {items.map((item, i) => (
        <div
          key={i}
          className="card"
          style={
            compact
              ? { padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }
              : { display: 'flex', flexDirection: 'column', gap: 14 }
          }
        >
          <div className="row-between">
            <span className="muted small">{itemLabel ? itemLabel(item, i) : `#${i + 1}`}</span>
            <button
              className="btn btn-ghost btn-icon"
              style={compact ? { width: 32, height: 32, fontSize: 13 } : undefined}
              onClick={() => removeItem(i)}
              title="Remove"
            >
              ✕
            </button>
          </div>
          {fields.map((f) => (
            <ProfileField
              key={f.key}
              field={f}
              value={item[f.key]}
              onChange={(v) => updateItem(i, f.key, v)}
            />
          ))}
        </div>
      ))}
      <button className="btn btn-ghost" onClick={addItem}>
        + Add
      </button>
    </div>
  );
}

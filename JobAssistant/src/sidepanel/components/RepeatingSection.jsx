import ProfileField from './ProfileField.jsx';
import * as ui from '../../styles/ui.js';

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
    <div className={`flex flex-col ${compact ? 'gap-2.5' : 'gap-3.5'}`}>
      {items.map((item, i) => (
        <div key={i} className={`${ui.card} flex flex-col ${compact ? 'p-3 gap-2.5' : 'gap-3.5'}`}>
          <div className={ui.rowBetween}>
            <span className={`${ui.muted} ${ui.small}`}>
              {itemLabel ? itemLabel(item, i) : `#${i + 1}`}
            </span>
            <button
              className={`${ui.btn} ${compact ? 'p-0 w-8 h-8 rounded-full text-[13px]' : ui.btnIcon}`}
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
      <button className={ui.btn} onClick={addItem}>
        + Add
      </button>
    </div>
  );
}

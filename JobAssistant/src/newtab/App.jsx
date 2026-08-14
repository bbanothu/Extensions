import { useEffect, useMemo, useState } from 'react';
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Logo from '../components/Logo.jsx';
import { getGridTiles, setGridTiles } from '../lib/storage.js';
import GridTile from './components/GridTile.jsx';
import * as ui from '../styles/ui.js';

export default function App() {
  const { width, containerRef, mounted } = useContainerWidth();
  const [tiles, setTiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [addingUrl, setAddingUrl] = useState('');
  const [addingLabel, setAddingLabel] = useState('');

  useEffect(() => {
    getGridTiles().then((t) => {
      setTiles(t);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setGridTiles(tiles);
  }, [tiles, loaded]);

  const layout = useMemo(
    () => tiles.map((t) => ({ i: t.id, x: t.x, y: t.y, w: t.w, h: t.h })),
    [tiles],
  );

  function onLayoutChange(next) {
    setTiles((prev) =>
      prev.map((t) => {
        const l = next.find((n) => n.i === t.id);
        return l ? { ...t, x: l.x, y: l.y, w: l.w, h: l.h } : t;
      }),
    );
  }

  function addTile(e) {
    e.preventDefault();
    const raw = addingUrl.trim();
    if (!raw) return;
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let label = addingLabel.trim();
    if (!label) {
      try {
        label = new URL(url).hostname.replace(/^www\./, '');
      } catch {
        label = url;
      }
    }
    const maxY = tiles.reduce((m, t) => Math.max(m, t.y + t.h), 0);
    setTiles((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label, url, x: 0, y: maxY, w: 6, h: 8 },
    ]);
    setAddingUrl('');
    setAddingLabel('');
  }

  function removeTile(id) {
    setTiles((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-4 px-6 py-4 shrink-0">
        <Logo className="shrink-0" />
        <h1 className="text-xl font-bold m-0 tracking-[-0.3px] lowercase shrink-0">
          Resume Assistant
        </h1>
        <form className="flex gap-2 flex-1" onSubmit={addTile}>
          <input
            type="url"
            className={`${ui.input} py-2.5 px-4 text-sm flex-[2]`}
            placeholder="https://..."
            value={addingUrl}
            onChange={(e) => setAddingUrl(e.target.value)}
          />
          <input
            type="text"
            className={`${ui.input} py-2.5 px-4 text-sm flex-1`}
            placeholder="Label (optional)"
            value={addingLabel}
            onChange={(e) => setAddingLabel(e.target.value)}
          />
          <button
            className={`${ui.btn} ${ui.btnPrimary} py-2.5 px-5 text-sm shrink-0`}
            type="submit"
          >
            Add Tile
          </button>
        </form>
        <ThemeToggle />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6" ref={containerRef}>
        {mounted && loaded && (
          <ReactGridLayout
            width={width}
            layout={layout}
            gridConfig={{ cols: 12, rowHeight: 32, margin: [14, 14] }}
            dragConfig={{ enabled: true, handle: '.grid-tile-handle' }}
            onLayoutChange={onLayoutChange}
          >
            {tiles.map((tile) => (
              <div key={tile.id}>
                <GridTile tile={tile} onRemove={() => removeTile(tile.id)} />
              </div>
            ))}
          </ReactGridLayout>
        )}
      </div>
    </div>
  );
}

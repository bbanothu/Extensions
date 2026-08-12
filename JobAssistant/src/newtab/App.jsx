import { useEffect, useMemo, useState } from 'react';
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { getGridTiles, setGridTiles } from '../lib/storage.js';
import GridTile from './components/GridTile.jsx';

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
    <div className="newtab-app">
      <div className="newtab-header">
        <div className="logo" />
        <h1>Job Assistant</h1>
        <form className="add-tile-form" onSubmit={addTile}>
          <input
            type="url"
            placeholder="https://..."
            value={addingUrl}
            onChange={(e) => setAddingUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Label (optional)"
            value={addingLabel}
            onChange={(e) => setAddingLabel(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Add Tile
          </button>
        </form>
        <ThemeToggle />
      </div>

      <div className="tile-grid-container" ref={containerRef}>
        {mounted && loaded && (
          <ReactGridLayout
            className="tile-grid"
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

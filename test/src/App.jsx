// App.js
import { useEffect, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import {
  fetchUnsplash,
  fetchTenor,
  setSelectedImage,
  setSelectedGif,
  setPalette,
  setSetting,
  saveFavorite,
  removeFavorite,
  clearError,
} from './redux/wallpaperSlice';
import './index.css';

function avgColorFromCanvas(imgEl, left = 0, top = 0, w = 1, h = 1) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = imgEl.naturalWidth || imgEl.width;
    canvas.height = imgEl.naturalHeight || imgEl.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, 0, 0);
    const sx = Math.floor(left * canvas.width);
    const sy = Math.floor(top * canvas.height);
    const sw = Math.max(1, Math.floor(w * canvas.width));
    const sh = Math.max(1, Math.floor(h * canvas.height));
    const data = ctx.getImageData(sx, sy, sw, sh).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4 * 8) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    return rgbToHex(r, g, b);
  } catch (e) {
    return '#222222';
  }
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const s = x.toString(16);
        return s.length === 1 ? '0' + s : s;
      })
      .join('')
  );
}

function useApp() {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.wallpaper);
  return { state, dispatch };
}

function InnerApp() {
  const { state, dispatch } = useApp();
  const [q, setQ] = useState('cyberpunk');
  const previewImgRef = useRef(null);
  const [savingPulse, setSavingPulse] = useState(false);

  useEffect(() => {
    dispatch(fetchUnsplash(q));
    dispatch(fetchTenor('sparkle'));
  }, []); // initial

  useEffect(() => {
    if (!state.selectedImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = state.selectedImage.url;
    img.onload = () => {
      const c1 = avgColorFromCanvas(img, 0.05, 0.3, 0.2, 0.4);
      const c2 = avgColorFromCanvas(img, 0.4, 0.4, 0.2, 0.4);
      const c3 = avgColorFromCanvas(img, 0.75, 0.2, 0.2, 0.4);
      dispatch(setPalette([c1, c2, c3]));
    };
  }, [state.selectedImage, dispatch]);

  const doSearch = () => {
    if (!q || q.trim().length === 0) return;
    dispatch(clearError());
    dispatch(fetchUnsplash(q));
    dispatch(fetchTenor(q));
  };

  const applyImage = (img) => dispatch(setSelectedImage(img));
  const applyGif = (g) => dispatch(setSelectedGif(g));

  const saveCurrent = () => {
    if (!state.selectedImage) return;
    const payload = {
      id: 'fav-' + Date.now(),
      keyword: q,
      palette: state.palette,
      imageUrl: state.selectedImage.url,
      gifUrl: state.selectedGif?.url || null,
      createdAt: new Date().toISOString(),
    };
    dispatch(saveFavorite(payload));
    setSavingPulse(true);
    setTimeout(() => setSavingPulse(false), 900);
  };

  const removeFav = (id) => dispatch(removeFavorite(id));

  const gradient = `linear-gradient(120deg, ${state.palette[0]} 0%, ${state.palette[1]} 50%, ${state.palette[2]} 100%)`;

  return (
    <div>
      <div className="app">
      <header className="header">
        <h1>Aesthetic Remix — Live Wallpaper Studio</h1>
        <p className="sub">Type a keyword, fetch real images and GIFs, tweak preview, save favorites.</p>
      </header>

      <div className="row">
        <div className="left">
          <div className="searchRow">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSearch()}
              placeholder="e.g. cyberpunk, ocean, retro"
              className="input"
            />
            <button onClick={doSearch} className="btn">Search</button>
            {/* <button onClick={() => dispatch(setSetting({ key: 'overlayOpacity', value: Math.max(0, Math.round((state.settings.overlayOpacity - 0.1) * 10) / 10)))} className="btnSmall">-</button> */}
            {/* <button onClick={() => dispatch(setSetting({ key: 'overlayOpacity', value: Math.min(1, Math.round((state.settings.overlayOpacity + 0.1) * 10) / 10)))} className="btnSmall">+</button> */}
          </div>

          <div className="preview" style={{ height: 360 }}>
            <div
              className="gradientLayer"
              style={{
                background: gradient,
                filter: `blur(${state.settings.blur}px)`,
                transform: `scale(${1 + (state.settings.speed - 1) * 0.02})`,
              }}
            />

            {state.selectedImage && (
              <img
                ref={previewImgRef}
                src={state.selectedImage.url}
                alt="bg"
                className="previewImg"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 10 * state.settings.speed;
                  const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 8 * state.settings.speed;
                  e.currentTarget.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.02)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.02)';
                }}
              />
            )}

            {state.selectedGif && (
              <img
                src={state.selectedGif.url}
                alt="gif"
                className="gifOverlay"
                style={{ opacity: state.settings.overlayOpacity }}
              />
            )}

            <div className="paletteChips">
              {state.palette.map((c, i) => (
                <div key={i} className="chip" style={{ background: c }} title={c} />
              ))}
            </div>

            {savingPulse && <div className="savePulse" />}
          </div>

          <div className="controls">
            <div className="controlBtns">
              <button onClick={() => dispatch(setSetting({ key: 'blur', value: Math.max(0, state.settings.blur - 2) }))} className="btnSmall">blur -</button>
              <button onClick={() => dispatch(setSetting({ key: 'blur', value: Math.min(40, state.settings.blur + 2) }))} className="btnSmall">blur +</button>
              {/* <button onClick={() => dispatch(setSetting({ key: 'speed', value: Math.max(0.2, Math.round((state.settings.speed - 0.2) * 10) / 10))} )} className="btnSmall">speed -</button>
              <button onClick={() => dispatch(setSetting({ key: 'speed', value: Math.min(3, Math.round((state.settings.speed + 0.2) * 10) / 10))} )} className="btnSmall">speed +</button> */}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={saveCurrent} className="btn saveBtn">Save Wallpaper</button>
            </div>
          </div>

          <div className="thumbSection">
            <div className="thumbLabel">Images</div>
            <div className="thumbnails">
              {state.loadingImages ? <div className="loading">Loading images...</div> : state.images.map(img => (
                <img
                  key={img.id}
                  src={img.thumb}
                  alt=""
                  onClick={() => applyImage(img)}
                  className={`thumb ${state.selectedImage?.id === img.id ? 'selectedThumb' : ''}`}
                />
              ))}
            </div>

            <div className="thumbLabel">GIF overlays</div>
            <div className="thumbnails">
              {state.loadingGifs ? <div className="loading">Loading gifs...</div> : state.gifs.map(g => (
                <img
                  key={g.id}
                  src={g.url}
                  alt=""
                  onClick={() => applyGif(g)}
                  className={`thumb ${state.selectedGif?.id === g.id ? 'selectedThumb' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="right">
          <div className="card settingsCard">
            <div className="cardTitle">Settings</div>
            <label className="label">Overlay opacity: {state.settings.overlayOpacity}</label>
            <input className="range" type="range" min="0" max="1" step="0.05" value={state.settings.overlayOpacity} onChange={(e) => dispatch(setSetting({ key: 'overlayOpacity', value: Number(e.target.value) }))} />
            <label className="label">Blur: {state.settings.blur}px</label>
            <input className="range" type="range" min="0" max="40" step="1" value={state.settings.blur} onChange={(e) => dispatch(setSetting({ key: 'blur', value: Number(e.target.value) }))} />
            <label className="label">Speed: {state.settings.speed}x</label>
            <input className="range" type="range" min="0.2" max="3" step="0.1" value={state.settings.speed} onChange={(e) => dispatch(setSetting({ key: 'speed', value: Number(e.target.value) }))} />
          </div>

          <div className="card favoritesCard">
            <div className="favHeader">
              <div className="cardTitle">Favorites</div>
              <div className="muted">{state.favorites.length}</div>
            </div>

            <div className="favList">
              {state.favorites.length === 0 && <div className="muted">No saved wallpapers yet</div>}
              {state.favorites.map(f => (
                <div key={f.id} className="favItem">
                  <div className="favThumb"><img src={f.imageUrl} alt="" /></div>
                  <div className="favMeta">
                    <div className="favTitle">{f.keyword}</div>
                    <div className="muted">{new Date(f.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="favActions">
                    <button className="btnSmall" onClick={() => { dispatch(setSelectedImage({ url: f.imageUrl, id: f.id })); if (f.gifUrl) dispatch(setSelectedGif({ url: f.gifUrl, id: f.id + '-g' })); }}>Apply</button>
                    <button className="btnSmall danger" onClick={() => removeFav(f.id)}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="foot muted">APIs used: Unsplash (photos) and Tenor (GIFs). Put keys in wallpaperSlice.js</div>
        </aside>
    </div>
    </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <InnerApp />
    </Provider>
  );
}

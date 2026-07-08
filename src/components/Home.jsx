import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { validateQuizData } from '../utils/validate.js';

export default function Home({ onSelectQuiz }) {
  const [manifest, setManifest] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [uploadErrors, setUploadErrors] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}data/manifest.json`)
      .then((res) => {
        if (!res.ok) throw new Error('manifest fetch failed');
        return res.json();
      })
      .then(setManifest)
      .catch(() => setLoadError('プリセット問題集の一覧を読み込めませんでした。'));
  }, []);

  async function handlePresetClick(entry) {
    setUploadErrors(null);
    try {
      const base = import.meta.env.BASE_URL;
      const res = await fetch(`${base}${entry.file}`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const { valid, errors } = validateQuizData(data);
      if (!valid) {
        setLoadError(`「${entry.title}」の読み込みに失敗しました：${errors[0]}`);
        return;
      }
      onSelectQuiz({ id: `preset:${entry.id}`, title: entry.title, questions: data });
    } catch {
      setLoadError(`「${entry.title}」を読み込めませんでした。`);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadErrors(null);
    setLoadError(null);

    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try {
        data = JSON.parse(reader.result);
      } catch {
        setUploadErrors(['JSONとして読み込めませんでした。ファイル形式を確認してください。']);
        return;
      }
      const { valid, errors } = validateQuizData(data);
      if (!valid) {
        setUploadErrors(errors);
        return;
      }
      const title = file.name.replace(/\.json$/i, '');
      onSelectQuiz({ id: `custom:${file.name}`, title, questions: data });
    };
    reader.onerror = () => setUploadErrors(['ファイルの読み込みに失敗しました。']);
    reader.readAsText(file);
  }

  return (
    <div className="home">
      <section className="hero-block">
        <h1 className="hero-title">
          問題集を選んで
          <br />
          マークしよう
        </h1>
        <p className="hero-sub">
          プリセットから選ぶか、自分のJSONファイルを読み込んで出題できます。
        </p>
      </section>

      {loadError && (
        <div className="alert alert-error">
          <Icon name="error" size={18} />
          <span>{loadError}</span>
        </div>
      )}

      <section>
        <h2 className="section-title">プリセット問題集</h2>
        <div className="preset-list">
          {manifest === null && !loadError && <p className="muted">読み込み中…</p>}
          {manifest?.map((entry) => (
            <button
              key={entry.id}
              className="preset-row"
              onClick={() => handlePresetClick(entry)}
            >
              <span className="preset-bubble">
                <Icon name="quiz" size={20} />
              </span>
              <span className="preset-info">
                <span className="preset-title">{entry.title}</span>
                {entry.description && <span className="preset-desc">{entry.description}</span>}
              </span>
              <Icon name="chevron_right" className="preset-chevron" />
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">自分のファイルを読み込む</h2>
        <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
          <Icon name="upload_file" size={26} />
          <p className="upload-text">
            <strong>タップしてJSONファイルを選択</strong>
            <br />
            端末内で処理され、外部には送信されません
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleFileChange}
        />
        {uploadErrors && (
          <div className="alert alert-error">
            <Icon name="error" size={18} />
            <div>
              <p style={{ marginBottom: 4 }}>ファイルの形式に問題があります：</p>
              <ul className="error-list">
                {uploadErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

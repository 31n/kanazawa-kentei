import Icon from './Icon.jsx';

function getBasis(question) {
  const text = typeof question.basis?.text === 'string' ? question.basis.text.trim() : '';
  const rawUrl = typeof question.basis?.url === 'string' ? question.basis.url.trim() : '';
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : '';
  return { text, url };
}

export function hasExplanation(question) {
  const { text, url } = getBasis(question);
  return Boolean(question.explanation || text || url);
}

export default function Explanation({ question }) {
  const { text, url } = getBasis(question);

  return (
    <>
      {question.explanation && <p className="explanation">{question.explanation}</p>}
      {(text || url) && (
        <div className="basis">
          <span className="basis-label">根拠</span>
          {text && <p className="basis-text">{text}</p>}
          {url && (
            <a
              className="btn btn-secondary basis-link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="open_in_new" size={16} />
              参考リンクを開く
            </a>
          )}
        </div>
      )}
    </>
  );
}

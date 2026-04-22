import '@/shared/styles/PageSectionHeader.css';

function PageSectionHeader({ eyebrow = 'EXPO APPLY', title, description }) {
  return (
    <header className="page-section-header">
      <span className="page-section-header__eyebrow">{eyebrow}</span>
      <h1 className="page-section-header__title">{title}</h1>
      {description ? <p className="page-section-header__description">{description}</p> : null}
    </header>
  );
}

export default PageSectionHeader;

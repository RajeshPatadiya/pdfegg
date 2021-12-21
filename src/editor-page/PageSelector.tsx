interface PageSelectorProps {
  selectedPageNumber: number;
  totalPageCount: number;
  onChanged: (selectedPageNumber: number) => void;
}

function PageSelector(p: PageSelectorProps) {
  const hasPrev = p.selectedPageNumber > 1;
  const hasNext = p.selectedPageNumber < p.totalPageCount;

  const prevPage = () => p.onChanged(p.selectedPageNumber - 1);
  const nextPage = () => p.onChanged(p.selectedPageNumber + 1);

  return (
    <nav className="pdf-viewer__nav">
      <p>
        {p.selectedPageNumber} / {p.totalPageCount}
      </p>
      <button disabled={!hasPrev} onClick={prevPage}>
        Prev
      </button>
      <button disabled={!hasNext} onClick={nextPage}>
        Next
      </button>
    </nav>
  );
}

export default PageSelector;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const visiblePages = 5;

    const goToPage = (page) => {
        if (page >= 0 && page < totalPages) {
            onPageChange(page);
        }
    };

    let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
    let end = Math.min(start + visiblePages, totalPages);

    if (end - start < visiblePages) {
        start = Math.max(0, end - visiblePages);
    }

    const pages = [];
    for (let i = start; i < end; i++) {
        pages.push(
            <button key={i} onClick={() => goToPage(i)}
                style={{
                    margin: "0 4px",
                    padding: "6px 12px",
                    backgroundColor: i === currentPage ? "#4CAF50" : "#f1f1f1",
                    color: i === currentPage ? "white" : "black",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                {i + 1}
            </button>
        );
    }

    return (
        <div style={{ marginTop: "20px" }}>
            <button onClick={() => goToPage(0)} disabled={currentPage === 0}>⏮</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>⬅️</button>
            {pages}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>➡️</button>
            <button onClick={() => goToPage(totalPages - 1)} disabled={currentPage + 1 >= totalPages}>⏭</button>
        </div>
    );
};

export default Pagination;

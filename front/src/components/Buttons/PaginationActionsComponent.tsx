import "@/styles/Buttons/PaginationActionsStyle.css"

// Utils
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons/Icons"


export default function PaginationActionsComponent(
    { currentPage, totalPages, setCurrentPage }
    :
    { readonly currentPage: number, readonly totalPages: number, readonly setCurrentPage: (page: number) => void }
) {
    const getVisiblePages = (): (number | '...')[] => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const isStart = currentPage <= 3
        const isEnd = currentPage >= totalPages - 2

        if (isStart) {
            const startPages = [1, 2, 3].filter(p => p <= totalPages)
            return [...startPages, '...', totalPages]
        }

        if (isEnd) {
            const endPages = [totalPages - 2, totalPages - 1, totalPages].filter(p => p > 1)
            return [1, '...', ...endPages]
        }

        return [1, '...', currentPage, '...', totalPages]
    }

    const visiblePages = getVisiblePages()

    return (
        <section className="pagination-actions-container">
            {/* Prev Button */}
            <button
                className="pagination-button-base"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <div className="h-4"><ArrowLeftIcon size={"fill"} /></div>
            </button>

            {/* Page Numbers Buttons */}
            {visiblePages.map((page, index) =>
                page === '...'
                    ?   <span
                            key={`ellipsis-${index}`}
                            className="pagination-ellipsis"
                        >
                            ...
                        </span>
                    :   <button
                            key={page}
                            className={page === currentPage ? "pagination-button-active" : "pagination-button-base"}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
            )}

            {/* Next Button */}
            <button
                className="pagination-button-base"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <div className="h-4"><ArrowRightIcon size={"fill"} /></div>
            </button>
        </section>
    )
}
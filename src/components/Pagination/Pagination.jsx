import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const handlePrev = () => {
		if (currentPage > 0) {
			onPageChange(currentPage - 1)
		}
	}

	const handleNext = () => {
		if (currentPage < totalPages - 1) {
			onPageChange(currentPage + 1)
		}
	}

	const handlePageClick = page => {
		onPageChange(page)
	}

	const getPageNumbers = () => {
		const pages = []
		const maxVisible = 5

		if (totalPages <= maxVisible) {
			for (let i = 0; i < totalPages; i++) {
				pages.push(i)
			}
		} else {
			if (currentPage < 3) {
				for (let i = 0; i < 4; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages - 1)
			} else if (currentPage > totalPages - 4) {
				pages.push(0)
				pages.push('...')
				for (let i = totalPages - 4; i < totalPages; i++) {
					pages.push(i)
				}
			} else {
				pages.push(0)
				pages.push('...')
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages - 1)
			}
		}

		return pages
	}

	return (
		<div className='reviews-section__pagination pagination'>
			<button
				onClick={handlePrev}
				disabled={currentPage === 0}
				className='pagination__arrow'
				aria-label='Предыдущая страница'
			>
				<svg
					width='1.3vw'
					height='2.34vw'
					viewBox='0 0 25 45'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M1.11919e-06 22.1737L24.9944 2.39807e-05L24.9944 44.3474L1.11919e-06 22.1737Z'
						fill='#9CA8A9'
						fillOpacity={currentPage === 0 ? '0.2' : '0.39'}
					/>
				</svg>
			</button>
			<span className='pagination__numbers'>
				{getPageNumbers().map((page, index) => {
					if (page === '...') {
						return (
							<span key={`ellipsis-${index}`} className='pagination__ellipsis'>
								...
							</span>
						)
					}
					return (
						<button
							key={page}
							onClick={() => handlePageClick(page)}
							className={`pagination__number ${
								page === currentPage ? 'pagination__number--active' : ''
							}`}
						>
							{page + 1}
						</button>
					)
				})}
			</span>
			<button
				onClick={handleNext}
				disabled={currentPage >= totalPages - 1}
				className='pagination__arrow'
				aria-label='Следующая страница'
			>
				<svg
					width='1.3vw'
					height='2.34vw'
					viewBox='0 0 25 45'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M24.9944 22.1737L1.69851e-05 44.3474L1.89235e-05 -1.4444e-05L24.9944 22.1737Z'
						fill='#9CA8A9'
						fillOpacity={currentPage >= totalPages - 1 ? '0.2' : '0.39'}
					/>
				</svg>
			</button>
		</div>
	)
}

export default Pagination

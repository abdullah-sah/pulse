export default function RefreshCircle() {
	return (
		<svg
			className='animate-spin'
			viewBox='0 0 24 24'
			width='24'
			height='24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<circle
				cx='12'
				cy='12'
				r='8'
				fill='none'
				stroke='white'
				strokeWidth='2'
				strokeLinecap='round'
				strokeDasharray='12 12'
				strokeDashoffset='10'
			/>
		</svg>
	);
}

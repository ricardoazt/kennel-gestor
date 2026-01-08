import React from 'react';

const Header = () => {
	return (
		<header className="flex-shrink-0 flex items-center justify-between whitespace-nowrap border-b px-6 py-4 bg-white z-20" style={{ height: '72px', borderBottom: '1px solid var(--border-color)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
			<div className="flex items-center gap-4 text-gray-800">
				<div className="size-6 text-primary" style={{ width: '24px', height: '24px', color: 'var(--primary-color)' }}>
					<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
					</svg>
				</div>
				<h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-gray-900)' }}>
					Kennel Gestor
				</h2>
			</div>
			<div className="flex items-center justify-end">
				<div
					className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
					style={{
						width: '40px',
						height: '40px',
						borderRadius: '50%',
						backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCdurLi-fe90d9ac-cKz7G7tm4lAIAAi_m4FyxAXMxUYpK_D2o0tuc8KvkmiCPY8y5CmfByKOLK5bofbTfFFJhAv5S_wT-D0Dk_sP-WAEs7niQLxrBtKiANC884qhbKBaLFJ1Oxr-Lo_NTUdDxywRL98imBrz55SVX_ZRQhFwBOuItoeALYPOAu65ooCYtkBA_1XvU5aXZXXQQbtjxaYp5RPvCa4dRXoJKDt1s86fAyAXghg_fVN6bARUt7cUNPfOncpqIcekh8CJS")',
						backgroundSize: 'cover',
						backgroundPosition: 'center'
					}}
				></div>
			</div>
		</header>
	);
};

export default Header;

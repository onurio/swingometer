import { useEffect, useState } from "react";

export default function useDevice() {
	const [dimensions, setDimensions] = useState({
		width: global.innerWidth,
		height: global.innerHeight,
		isMobile: global.innerWidth < 768,
	});

	const onResize = () => {
		const width = global.innerWidth;
		const height = global.innerHeight;

		const isMobile = width < 768;
		setDimensions({
			width,
			height,
			isMobile,
		});
	};

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	return dimensions;
}

"use client";
import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import Container from "./Container";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Phone from "./Phone";

const PHONES = [
	"/testimonials/1.jpg",
	"/testimonials/2.jpg",
	"/testimonials/3.jpg",
	"/testimonials/4.jpg",
	"/testimonials/5.jpg",
	"/testimonials/6.jpg",
];

const splitArray = <T,>(array: Array<T>, numParts: number): Array<Array<T>> => {
	const result: Array<Array<T>> = [];

	array.forEach((item, i) => {
		const index = i % numParts;
		if (!result[index]) {
			result[index] = [];
		}
		result[index].push(item);
	});
	return result;
};

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
	imgSrc: string;
}

const Review = ({ imgSrc, className, ...props }: ReviewProps) => {
	const POSSIBLE_ANIMATION_DELAYS = [
		"0s",
		"0.1s",
		"0.2s",
		"0.3s",
		"0.4s",
		"0.5s",
	];

	const animationDelay =
		POSSIBLE_ANIMATION_DELAYS[
			Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
		];

	return (
		<div
			className={cn(
				"animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
				className
			)}
			style={{ animationDelay }}
			{...props}
		>
			<Phone imgSrc={imgSrc} />
		</div>
	);
};

const ReviewColumn = ({
	phones,
	className,
	reviewClassName,
	msPerPixel = 0,
}: {
	phones: string[];
	className?: string;
	reviewClassName?: (reviewIndex: number) => string;
	msPerPixel?: number;
}) => {
	const columnRef = useRef<HTMLDivElement | null>(null);
	const [colHeight, setColHeight] = useState(0);
	const duration = `${colHeight * msPerPixel}ms`;

	useEffect(() => {
		if (!columnRef.current) return;

		const resizeObserver = new window.ResizeObserver(() => {
			setColHeight(columnRef.current?.offsetHeight ?? 0);
		});

		resizeObserver.observe(columnRef.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div
			ref={columnRef}
			className={cn("animate-marquee space-y-8 py-4", className)}
			style={{ "--marquee-duration": duration } as React.CSSProperties}
		>
			{phones.concat(phones).map((imgSrc, index) => (
				<Review
					key={index}
					className={reviewClassName?.(index % phones.length)}
					imgSrc={imgSrc}
				/>
			))}
		</div>
	);
};

const ReviewGrid = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.4 });
	const columns = splitArray(PHONES, 3);
	const col1 = columns[1];
	const col2 = columns[2];
	const col3 = splitArray(columns[2], 2);

	return (
		<div
			ref={containerRef}
			className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
		>
			{isInView && (
				<>
					<ReviewColumn
						phones={[...col1, ...col3.flat(), ...col2]}
						reviewClassName={(index) =>
							cn({
								"md:hidden": index >= col1.length + col3[0].length,
								"lg:hidden": index >= col1.length,
							})
						}
						msPerPixel={10}
					/>
					<ReviewColumn
						phones={[...col2, ...col3[1]]}
						className="hidden md:block"
						reviewClassName={(index) =>
							index >= col2.length ? "lg:hidden" : ""
						}
						msPerPixel={15}
					/>
					<ReviewColumn
						phones={col3.flat()}
						className="hidden md:block"
						msPerPixel={10}
					/>
				</>
			)}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100" />

		</div>
	);
};

const Reviews = () => {
	return (
		<Container className="relative max-w-5xl">
			<ReviewGrid />
		</Container>
	);
};

export default Reviews;

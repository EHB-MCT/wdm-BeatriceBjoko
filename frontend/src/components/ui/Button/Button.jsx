import React from "react";
import "./Button.css";

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {string} [props.variant='primary'] - Button variant: 'primary' | 'secondary'
 * @param {string} [props.size='medium'] - Button size: 'small' | 'medium' | 'large'
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.loading=false] - Whether button is in loading state
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {function} [props.onClick] - Click handler
 * @param {...any} ...rest - Additional props to pass to button element
 */
export default function Button({ 
	variant = "primary", 
	size = "medium", 
	disabled = false, 
	loading = false, 
	className = "", 
	children, 
	onClick, 
	...rest 
}) {
	const getClasses = () => {
		const classes = ["ui-btn"];
		classes.push(`ui-btn--${variant}`);
		
		if (size !== "medium") {
			classes.push(`ui-btn--${size}`);
		}
		
		if (loading) {
			classes.push("ui-btn--loading");
		}
		
		if (className) {
			classes.push(className);
		}
		
		return classes.join(" ");
	};

	const handleClick = (e) => {
		if (loading || disabled) {
			e.preventDefault();
			return;
		}
		onClick?.(e);
	};

	const isDisabled = disabled || loading;

	return (
		<button
			className={getClasses()}
			disabled={isDisabled}
			onClick={handleClick}
			{...rest}
		>
			{children}
		</button>
	);
}
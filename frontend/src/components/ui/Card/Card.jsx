import React from "react";
import "./Card.css";

/**
 * Reusable Card Component
 * 
 * @param {Object} props
 * @param {string} [props.variant='default'] - Card variant: 'default' | 'admin' | 'analytics' | 'info' | 'auth' | 'insight'
 * @param {string} [props.size='medium'] - Card size: 'small' | 'medium' | 'large'
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.title] - Card title
 * @param {string} [props.description] - Card description
 * @param {boolean} [props.hoverable=false] - Whether card should have hover effects
 * @param {boolean} [props.loading=false] - Whether card is in loading state
 * @param {React.ReactNode} props.children - Card content
 * @param {...any} ...rest - Additional props to pass to div element
 */
export default function Card({ 
	variant = "default", 
	size = "medium", 
	className = "", 
	title, 
	description, 
	hoverable = false, 
	loading = false, 
	children, 
	...rest 
}) {
	const getClasses = () => {
		const classes = ["ui-card"];
		
		if (variant !== "default") {
			classes.push(`ui-card--${variant}`);
		}
		
		if (size !== "medium") {
			classes.push(`ui-card--${size}`);
		}
		
		if (hoverable) {
			classes.push("ui-card--hoverable");
		}
		
		if (loading) {
			classes.push("ui-card--loading");
		}
		
		if (className) {
			classes.push(className);
		}
		
		return classes.join(" ");
	};

	const renderContent = () => {
		if (loading) {
			return <div className="ui-card__content">Loading...</div>;
		}

		return (
			<div className="ui-card__content">
				{title && <h3 className="ui-card__title">{title}</h3>}
				{description && <p className="ui-card__description">{description}</p>}
				{children}
			</div>
		);
	};

	return (
		<div className={getClasses()} {...rest}>
			{renderContent()}
		</div>
	);
}
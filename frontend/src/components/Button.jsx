import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonHover } from '../utils/motion';

// Define motion components at module level — avoids remounting on every render
const MotionLink = motion(Link);
const MotionA = motion('a');
const MotionButton = motion('button');

export default function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const classes = `btn btn-${variant} ${className}`.trim();

  if (to) {
    return (
      <MotionLink className={classes} to={to} {...buttonHover} {...props}>
        {children}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <MotionA className={classes} href={href} {...buttonHover} {...props}>
        {children}
      </MotionA>
    );
  }

  return (
    <MotionButton className={classes} type={props.type ?? 'button'} {...buttonHover} {...props}>
      {children}
    </MotionButton>
  );
}

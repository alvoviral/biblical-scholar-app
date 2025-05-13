
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureIconProps {
  icon: LucideIcon;
  title: string;
  to: string;
  className?: string;
  premium?: boolean;
  basic?: boolean;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({
  icon: Icon,
  title,
  to,
  className,
  premium = false,
  basic = false
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "feature-icon relative",
        className
      )}
    >
      <Icon />
      <span className="feature-title">{title}</span>
      {(premium || basic) && (
        <span 
          className={cn(
            "absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full",
            premium ? "bg-bible-secondary text-black" : "bg-bible-primary text-white"
          )}
        >
          {premium ? "Premium" : "Básico"}
        </span>
      )}
    </Link>
  );
};

export default FeatureIcon;

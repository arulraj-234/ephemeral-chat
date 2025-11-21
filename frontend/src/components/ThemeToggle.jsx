import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const ThemeToggle = () => {
  return (
    <AnimatedThemeToggler 
      className="btn btn-secondary btn-small theme-toggle-btn" 
      aria-label="Toggle theme" 
      title="Toggle theme"
    />
  );
};

export default ThemeToggle;

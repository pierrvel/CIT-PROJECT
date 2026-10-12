import React from 'react';
import * as LucideIcons from 'lucide-react';

const iconMap = {
  zap: LucideIcons.Zap,
  target: LucideIcons.Target,
  clock: LucideIcons.Clock,
  cloud: LucideIcons.Cloud,
  upload: LucideIcons.Upload,
  download: LucideIcons.Download,
  image: LucideIcons.Image,
  moon: LucideIcons.Moon,
  sun: LucideIcons.Sun,
  maximize: LucideIcons.Maximize,
  minimize: LucideIcons.Minimize,
  play: LucideIcons.Play,
  pause: LucideIcons.Pause,
  rotateCcw: LucideIcons.RotateCcw,
  plus: LucideIcons.Plus,
  minus: LucideIcons.Minus,
  check: LucideIcons.Check,
  alertTriangle: LucideIcons.AlertTriangle,
  trash2: LucideIcons.Trash2,
  trash: LucideIcons.Trash,
  sparkles: LucideIcons.Sparkles,
  x: LucideIcons.X,
  key: LucideIcons.Key,
  refreshCw: LucideIcons.RefreshCw,
  bell: LucideIcons.Bell,
  fastForward: LucideIcons.FastForward,
  settings: LucideIcons.Settings,
  arrowLeft: LucideIcons.ArrowLeft,
  arrowRight: LucideIcons.ArrowRight,
  checkCircle: LucideIcons.CheckCircle,
  barChart: LucideIcons.BarChart,
  bookmark: LucideIcons.Bookmark,
  save: LucideIcons.Save,
  trendingUp: LucideIcons.TrendingUp,
  trendingDown: LucideIcons.TrendingDown,
  fileText: LucideIcons.FileText,
  edit3: LucideIcons.Edit3,
  lightbulb: LucideIcons.Lightbulb,
  volume2: LucideIcons.Volume2,
  volumeX: LucideIcons.VolumeX,
  undo: LucideIcons.Undo,
  award: LucideIcons.Award,
  checkSquare: LucideIcons.CheckSquare,
  chevronRight: LucideIcons.ChevronRight,
  chevronDown: LucideIcons.ChevronDown,
  calculator: LucideIcons.Calculator,
  helpCircle: LucideIcons.HelpCircle,
  layers: LucideIcons.Layers
};

export const Icon = ({ name, className = "w-5 h-5", size = 20 }) => {
  const Component = iconMap[name];
  if (!Component) return null;
  return <Component className={className} size={size} />;
};

export default Icon;

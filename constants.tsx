
import React from 'react';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Wifi, 
  ShoppingCart, 
  Home, 
  PartyPopper,
  Trash2,
  Plus,
  UserPlus,
  Users,
  Calculator,
  LayoutGrid,
  Share2,
  FileText,
  Camera,
  MessageCircle,
  Mail
} from 'lucide-react';

export const INITIAL_ACCOUNTS = [
  { id: 'energia', name: 'ENERGIA', icon: <Zap size={24} />, color: 'bg-yellow-500', selected: true },
  { id: 'agua', name: 'ÁGUA', icon: <Droplets size={24} />, color: 'bg-blue-500', selected: true },
  { id: 'gas', name: 'GÁS', icon: <Flame size={24} />, color: 'bg-orange-600', selected: true },
  { id: 'internet', name: 'INTERNET', icon: <Wifi size={24} />, color: 'bg-purple-500', selected: true },
  { id: 'mercado', name: 'MERCADO', icon: <ShoppingCart size={24} />, color: 'bg-slate-700', selected: false },
  { id: 'iptu', name: 'IPTU', icon: <Home size={24} />, color: 'bg-indigo-800', selected: false },
  { id: 'festa', name: 'FESTA', icon: <PartyPopper size={24} />, color: 'bg-pink-600', selected: false },
];

export const ICONS = {
  Trash2,
  Plus,
  UserPlus,
  Users,
  Calculator,
  LayoutGrid,
  Share2,
  FileText,
  Camera,
  MessageCircle,
  Mail
};

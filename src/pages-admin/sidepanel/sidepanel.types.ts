
export interface MenuItem {
    icon: React.ReactElement;
    label: string;
    path: string;
    disabled: boolean;
}

export interface SidePanelProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}
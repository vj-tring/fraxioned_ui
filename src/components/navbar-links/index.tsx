import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "./navbar-links.module.css";

// Define a type for individual link items
interface Link {
  disabled?: boolean;
  name: string;
  href: string;
  onClick?: () => void;
}

// Define props type for the component
interface NavbarLinksProps {
  links: Link[];
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ links }) => {
  // Event handler for click event to prevent navigation on disabled links
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    disabled?: boolean
  ) => {
    if (disabled) {
      e.preventDefault();
    }
  };

  return (
    <Nav className={`mr-auto ${styles["navbar-links"]}`}>
      {links.map((link, index) => (
        <NavLink
          key={`${link.name}-${index}`}
          to={link.href}
          onClick={(e) => handleClick(e, link.disabled)}
          className={({ isActive }) =>
            `nav-link ${isActive ? styles.active : ""} ${styles["nav-link-with-margin"]} px-3`
          }
          style={{ textDecoration: "none" }}
          aria-disabled={link.disabled ? "true" : "false"}
        >
          {link.name}
        </NavLink>
      ))}
    </Nav>
  );
};

export default NavbarLinks;

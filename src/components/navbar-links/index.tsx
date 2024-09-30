import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "./navbar-links.module.css";

interface NavbarLinksProps {
  links: {
    disabled: boolean | undefined;
    name: string;
    href: string;
    onClick?: () => void;
  }[];
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ links }) => {
  return (
    <Nav className={`mr-auto ${styles["navbar-links"]}`}>
      {links.map((link, index) => (
        <NavLink
          key={index}
          to={link.href}
          onClick={(e) => {
            if (link.disabled) {
              e.preventDefault();
            }
          }}
          className={({ isActive }) =>
            `nav-link ${isActive ? styles.active : ""} ${
              styles["nav-link-with-margin"]
            } px-3`
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

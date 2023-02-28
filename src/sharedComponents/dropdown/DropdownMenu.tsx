import React, { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.scss";
import { Link } from "react-router-dom";
import { MenuItem } from "sharedComponents/navBar/Navbar";
type DropdownMenuProps = {
  menuItems: MenuItem[];
  children: React.ReactNode;
};
const DropdownMenu: React.FC<DropdownMenuProps> = ({ menuItems, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref: any = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (ref.current && !ref.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const MenuItems = () => {
    return (
      <div className={styles.dropdown}>
        {menuItems.map((item) => {
          const Icon = item?.Icon;
          return (
            <div className={styles.dropdown_item}>
              {Icon && (
                <div>
                  <Icon style={{ color: "green" }} />
                  {/* {
                                      cartData.items.length>0&& <span>{cartData.items.length} </span>
                                     } */}
                </div>
              )}
              <Link
                to={{
                  pathname: item?.path,
                }}
                className={styles.dropdown_item_text}
              >
                {item?.text}
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      ref={ref}
      className={styles.dropdown_wrapper}
    >
      <div className={styles.header_content}>{children}</div>
      {isOpen && <MenuItems />}
    </div>
  );
};
export default DropdownMenu;

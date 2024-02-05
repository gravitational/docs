import { NavigationItem } from "server/sanity-types";
import DropdownMenuItem from "./DropdownMenuItem";
import cn from "classnames";
import Icon from "components/Icon";
import DropdownSection from "./DropdownSection";
import styles from "./DropdownSubMenu.module.css";
import Link from "components/Link";
import { useState } from "react";

export interface DropdownMenuProps {
  items: NavigationItem["submenus"];
}

const DropdownSubMenu = ({ items }: DropdownMenuProps) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className={styles.subMenuWrapper}>
      <div className={styles.subMenus}>
        {items.map(({ submenuTitle, titleLink }, index) => {
          if (titleLink && titleLink.length > 0) {
            return (
              <Link
                href={titleLink}
                className={styles.submenuLink}
                key={`submenu-${submenuTitle}-${index}`}
              >
                {submenuTitle}
              </Link>
            );
          } else {
            return (
              <div
                key={`submenu-${submenuTitle}-${index}`}
                className={cn(
                  styles.subMenu,
                  index === activeTab ? styles.active : ""
                )}
                onClick={() => setActiveTab(index)}
              >
                {submenuTitle}
                <Icon name="arrowRight" size="sm" />
              </div>
            );
          }
        })}
      </div>
      {items
        ?.filter(({ titleLink }) => !titleLink)
        .map(({ submenuSections, submenuTitle }, i) => (
          <div
            key={`wrapper${submenuTitle}-${i}`}
            className={cn(styles.wrapper, i === activeTab ? styles.active : "")}
          >
            {submenuSections?.map((section, index) => (
              <DropdownSection
                key={`drsection${section.title}-${index}`}
                titleLink={false}
                isImageLink={false}
                title={section.title || undefined}
                subtitle={section.subtitle}
                isFirst={index === 0}
                className={cn(
                  styles.dropdownSection,
                  section.sectionItems.find(
                    ({ itemType }) => itemType === "normal"
                  ) && styles.normal,
                  index === submenuSections.length - 1 && styles.last
                )}
              >
                {section.sectionItems.map((sectionItemProps, i) => (
                  <DropdownMenuItem
                    key={`${sectionItemProps.title}-item${i}`}
                    title={sectionItemProps.title || undefined}
                    {...sectionItemProps}
                  />
                ))}
              </DropdownSection>
            ))}
          </div>
        ))}
    </div>
  );
};

export default DropdownSubMenu;

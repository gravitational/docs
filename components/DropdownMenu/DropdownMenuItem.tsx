import { css, transition } from "components/system";
import Box from "components/Box";
import Image from "components/Image";
import Link from "components/Link";
import Icon, { IconName } from "components/Icon";

export interface MenuItemProps {
  title: string;
  description: string;
  href: string;
  icon?: IconName;
  image?: string;
}

const DropdownMenuItem = ({
  icon,
  image,
  title,
  description,
  href,
}: MenuItemProps) => {
  return (
    <Link
      href={href}
      passthrough
      display="block"
      overflow="hidden"
      px={3}
      py={2}
      border={["1px solid", "none"]}
      borderColor="lightest-gray"
      borderRadius="sm"
      transition={transition([["background", "interaction"]])}
      lineHeight="md"
      textAlign="left"
      textDecoration="none"
      css={css({
        "&:focus, &:hover": {
          bg: "lightest-gray",
        },
        "& + &": {
          mt: 2,
        },
      })}
    >
      {image && (
        <Image
          src={image}
          alt=""
          float="left"
          mr={[0, 2]}
          mt={[2, 0]}
          border="10px solid transparent"
          width="60px"
          height="60px"
        />
      )}
      {icon && (
        <Icon name={icon} color="dark-purple" mt={1} mr={2} float="left" />
      )}
      <Box
        as="strong"
        display="block"
        fontSize="text-lg"
        lineHeight="lg"
        fontWeight="bold"
        color="dark-purple"
      >
        {title}
      </Box>
      <Box
        as="span"
        display="block"
        fontSize="text-md"
        lineHeight="md"
        color="darkest"
      >
        {description}
      </Box>
    </Link>
  );
};

export default DropdownMenuItem;

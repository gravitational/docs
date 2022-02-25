import Header, { HeaderBehaviour, HeaderMode } from "components/Header";
import Flex, { FlexProps } from "components/Flex";

export interface LayoutProps {
  children: React.ReactNode;
  mode?: HeaderMode;
  behaviour?: HeaderBehaviour;
  headerColor?: string;
  border?: string;
  shadow?: boolean;
}

const Layout = ({
  children,
  mode,
  behaviour = "static",
  headerColor,
  border,
  shadow = false,
  ...props
}: LayoutProps & FlexProps) => {
  return (
    <>
      {mode === "none" ? null : (
        <>
          <Header
            mode={mode}
            headerColor={headerColor}
            border={border}
            shadow={shadow}
          />
          <Flex
            as="main"
            pt={behaviour === "static" ? ["48px", "80px"] : undefined}
            flexDirection="column"
            {...props}
          >
            {children}
          </Flex>
        </>
      )}
    </>
  );
};

export default Layout;

import cn from "classnames";
import { Children, cloneElement, useMemo } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import styles from "./Image.module.css";

type PositioningValue = "left" | "center" | "right";
interface SharedProps {
  align?: PositioningValue;
  bordered?: boolean;
  caption?: string;
}

export type ImageProps = SharedProps & NextImageProps;

export const Image = ({
  align = "left",
  bordered,
  caption,
  ...props
}: ImageProps) => {
  return (
    <span className={cn(styles.wrapper, styles[align])}>
      {bordered ? (
        <span className={styles.border}>
          <NextImage {...props} layout="intrinsic" />
        </span>
      ) : (
        <NextImage {...props} layout="intrinsic" />
      )}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </span>
  );
};

type ImageComponent = React.ReactElement<typeof Image>;

export type FigureProps = ImageProps & {
  children: ImageComponent;
};

export const Figure = ({ children, ...rest }: FigureProps) => {
  if (Children.count(children) > 0) {
    const image = Children.toArray(children)[0] as ImageComponent;

    return cloneElement(image, rest);
  }

  return null;
};

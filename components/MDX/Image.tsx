import cn from "classnames";
import {
  Children,
  cloneElement,
  useCallback,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import styles from "./Image.module.css";
import {
  useClickOutside,
  useEscape,
  useDisableBodyScroll,
} from "server/custom-hooks";

type PositioningValue = "left" | "center" | "right";
interface SharedProps {
  align?: PositioningValue;
  bordered?: boolean;
  caption?: string;
  noPopUp?: boolean;
}

//** Maximum width of content block where images are placed.
/* If the original image is smaller, then there is no sense to expand the image by clicking. */
const MAX_CONTENT_WIDTH = 900;

export type ImageProps = SharedProps & NextImageProps;

type ModalImageProps = {
  setShowExpandedImage: Dispatch<SetStateAction<boolean>>;
} & ImageProps;

const ModalImage = ({ setShowExpandedImage, ...props }: ModalImageProps) => {
  const closeHandler = useCallback(
    () => setShowExpandedImage(false),
    [setShowExpandedImage]
  );
  const modalRef = useRef<HTMLDivElement>();
  useClickOutside(modalRef, closeHandler);
  useEscape(closeHandler);

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.modal} ref={modalRef}>
        <NextImage className={styles.image} {...props} />
      </div>
    </>
  );
};

export const Image = ({
  align = "left",
  bordered,
  caption,
  noPopUp = false,
  ...props
}: ImageProps) => {
  const [showExpandedImage, setShowExpandedImage] = useState(false);
  const shouldExpand = !noPopUp && props.width > MAX_CONTENT_WIDTH;
  useDisableBodyScroll(showExpandedImage);
  const handleClickImage = () => {
    if (shouldExpand) {
      setShowExpandedImage(true);
    }
  };

  return (
    <>
      <span className={cn(styles.wrapper, styles[align])}>
        {bordered ? (
          <span className={styles.border}>
            <NextImage
              {...props}
              className={cn(styles.image, shouldExpand && styles.clickable)}
              onClick={handleClickImage}
            />
          </span>
        ) : (
          <NextImage
            {...props}
            className={cn(styles.image, shouldExpand && styles.clickable)}
            onClick={handleClickImage}
          />
        )}
        {caption && (
          <figcaption className={styles.caption}>{caption}</figcaption>
        )}
      </span>
      {showExpandedImage && (
        <ModalImage setShowExpandedImage={setShowExpandedImage} {...props} />
      )}
    </>
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

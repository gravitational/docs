let scrollPosition = 0;

export default function blockBodyScroll(isPopupOpen: boolean) {
  const body = document.body;

  if (isPopupOpen) {
    body.style.removeProperty("overflow");
    body.style.removeProperty("position");
    body.style.removeProperty("top");
    window.scrollTo(0, scrollPosition);
  } else {
    scrollPosition = window.pageYOffset;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
  }
}

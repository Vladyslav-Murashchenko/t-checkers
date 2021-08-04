/**
 * util for composing classNames
 */
const cx = (...classNames: string[]) => {
  return classNames.filter(Boolean).join(" ");
};

export default cx;

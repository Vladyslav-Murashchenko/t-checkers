/**
 * @description
 * util for composing classNames
 */
const cx = (...classNames: any[]): string => {
  return classNames
    .filter((className) => className && typeof className === "string")
    .join(" ");
};

export default cx;

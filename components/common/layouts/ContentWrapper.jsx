// CONTENTWRAPPER FOR WRAPPING THE CONTENTS WITH COMMON STYLING
const ContentWrapper = ({ children, className = "" }) => {
  return <div className={`flex flex-col w-full ${className}`}>{children}</div>;
};

export default ContentWrapper;
